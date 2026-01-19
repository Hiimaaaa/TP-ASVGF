-- 1. Add likes_count column to avatars table
ALTER TABLE avatars 
ADD COLUMN IF NOT EXISTS likes_count integer DEFAULT 0;

-- 2. Create avatar_likes table to track individual likes
CREATE TABLE IF NOT EXISTS avatar_likes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  avatar_id uuid REFERENCES avatars(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(avatar_id, user_id) -- Prevent duplicate likes from same user
);

-- 3. Enable RLS
ALTER TABLE avatar_likes ENABLE ROW LEVEL SECURITY;

-- 4. Policies for avatar_likes

-- Allow anyone to read likes
CREATE POLICY "Anyone can read likes"
  ON avatar_likes FOR SELECT
  USING (true);

-- Allow authenticated users to insert (like)
CREATE POLICY "Authenticated users can like"
  ON avatar_likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own likes (unlike)
CREATE POLICY "Users can unlike"
  ON avatar_likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 5. Create a function to increment/decrement likes_count automatically
CREATE OR REPLACE FUNCTION handle_new_like()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE avatars
  SET likes_count = likes_count + 1
  WHERE id = NEW.avatar_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION handle_unlike()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE avatars
  SET likes_count = likes_count - 1
  WHERE id = OLD.avatar_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Triggers
DROP TRIGGER IF EXISTS on_like_added ON avatar_likes;
CREATE TRIGGER on_like_added
  AFTER INSERT ON avatar_likes
  FOR EACH ROW EXECUTE PROCEDURE handle_new_like();

DROP TRIGGER IF EXISTS on_like_removed ON avatar_likes;
CREATE TRIGGER on_like_removed
  AFTER DELETE ON avatar_likes
  FOR EACH ROW EXECUTE PROCEDURE handle_unlike();