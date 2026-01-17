-- Create a new storage bucket called 'blogImages'
insert into storage.buckets (id, name, public)
values ('blogImages', 'blogImages', true);

-- Set up access policy for the 'blogImages' bucket
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'blogImages' );

create policy "Authenticated Blog Upload"
  on storage.objects for insert
  with check ( bucket_id = 'blogImages' AND auth.role() = 'authenticated' );

create policy "Authenticated Blog Update"
  on storage.objects for update
  using ( bucket_id = 'blogImages' AND auth.role() = 'authenticated' );

create policy "Authenticated Blog Delete"
  on storage.objects for delete
  using ( bucket_id = 'blogImages' AND auth.role() = 'authenticated' );
