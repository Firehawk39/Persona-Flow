"""
PersonaFlow - Embedding Generation Script
Generates vector embeddings for journal entries using Ollama
"""

import os
from supabase import create_client, Client
import ollama
from typing import List, Dict
import time

# Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://your-project.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "your-service-role-key")
OLLAMA_MODEL = "nomic-embed-text"  # Optimized for embeddings
BATCH_SIZE = 10

# Initialize clients
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def generate_embedding(text: str) -> List[float]:
    """Generate embedding for a single text using Ollama"""
    try:
        response = ollama.embeddings(
            model=OLLAMA_MODEL,
            prompt=text
        )
        return response['embedding']
    except Exception as e:
        print(f"Error generating embedding: {e}")
        return None

def fetch_journal_entries_without_embeddings(limit: int = 100) -> List[Dict]:
    """Fetch journal entries that don't have embeddings yet"""
    try:
        response = supabase.table('journal_entries')\
            .select('id, content, mood, tags, created_at')\
            .is_('embedding', 'null')\
            .limit(limit)\
            .execute()
        
        return response.data
    except Exception as e:
        print(f"Error fetching entries: {e}")
        return []

def update_embedding(entry_id: str, embedding: List[float]) -> bool:
    """Update journal entry with generated embedding"""
    try:
        supabase.table('journal_entries')\
            .update({'embedding': embedding})\
            .eq('id', entry_id)\
            .execute()
        return True
    except Exception as e:
        print(f"Error updating embedding for {entry_id}: {e}")
        return False

def process_batch(entries: List[Dict]) -> int:
    """Process a batch of journal entries"""
    success_count = 0
    
    for entry in entries:
        # Combine content and mood for better embeddings
        text = f"{entry['mood']}: {entry['content']}"
        
        # Generate embedding
        embedding = generate_embedding(text)
        
        if embedding:
            # Update database
            if update_embedding(entry['id'], embedding):
                success_count += 1
                print(f"✓ Processed entry {entry['id'][:8]}... ({entry['mood']})")
            else:
                print(f"✗ Failed to update entry {entry['id'][:8]}...")
        else:
            print(f"✗ Failed to generate embedding for {entry['id'][:8]}...")
        
        # Small delay to avoid overwhelming Ollama
        time.sleep(0.1)
    
    return success_count

def main():
    """Main execution function"""
    print("🚀 PersonaFlow Embedding Generation")
    print("=" * 50)
    
    # Check if Ollama is running
    try:
        ollama.list()
        print("✓ Ollama is running")
    except Exception as e:
        print(f"✗ Ollama is not running. Please start it with: ollama serve")
        return
    
    # Check if embedding model is available
    try:
        models = ollama.list()
        model_names = [m['name'] for m in models.get('models', [])]
        if OLLAMA_MODEL not in model_names:
            print(f"⚠ Model {OLLAMA_MODEL} not found. Pulling...")
            ollama.pull(OLLAMA_MODEL)
            print(f"✓ Model {OLLAMA_MODEL} downloaded")
        else:
            print(f"✓ Model {OLLAMA_MODEL} is available")
    except Exception as e:
        print(f"✗ Error checking models: {e}")
        return
    
    # Process entries in batches
    total_processed = 0
    batch_num = 1
    
    while True:
        print(f"\n📦 Processing batch {batch_num}...")
        
        # Fetch entries without embeddings
        entries = fetch_journal_entries_without_embeddings(BATCH_SIZE)
        
        if not entries:
            print("\n✅ All entries have embeddings!")
            break
        
        print(f"Found {len(entries)} entries without embeddings")
        
        # Process batch
        success = process_batch(entries)
        total_processed += success
        
        print(f"Batch {batch_num}: {success}/{len(entries)} successful")
        
        batch_num += 1
        
        # Small delay between batches
        time.sleep(1)
    
    print("\n" + "=" * 50)
    print(f"🎉 Complete! Processed {total_processed} entries")
    print("\nNext steps:")
    print("1. Verify embeddings in Supabase")
    print("2. Test vector similarity search")
    print("3. Import advanced AI workflow to n8n")

if __name__ == "__main__":
    main()
