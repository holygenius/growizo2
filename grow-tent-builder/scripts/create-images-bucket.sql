-- Create a new storage bucket called 'images'
insert into storage.buckets (id, name, public)
values ('images', 'images', true);

-- Set up access policy for the 'images' bucket
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'images' );

create policy "Authenticated Custom Upload"
  on storage.objects for insert
  with check ( bucket_id = 'images' AND auth.role() = 'authenticated' );

create policy "Authenticated Custom Update"
  on storage.objects for update
  using ( bucket_id = 'images' AND auth.role() = 'authenticated' );

create policy "Authenticated Custom Delete"
  on storage.objects for delete
  using ( bucket_id = 'images' AND auth.role() = 'authenticated' );
