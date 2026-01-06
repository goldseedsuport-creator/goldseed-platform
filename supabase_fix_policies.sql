-- Enable Insert for Investments
create policy "Users can create investments"
on investments for insert
with check (auth.uid() = user_id);

-- Enable Delete for Investments (User can cancel pending ones)
create policy "Users can delete own investments"
on investments for delete
using (auth.uid() = user_id);

-- Enable Insert for Withdrawals
create policy "Users can create withdrawals"
on withdrawals for insert
with check (auth.uid() = user_id);

-- Enable Read for Withdrawals (if missing)
-- (Already added in previous schema, but good to ensure coverage)
