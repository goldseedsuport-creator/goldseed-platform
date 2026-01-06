-- Add transaction_hash column to investments
alter table investments 
add column if not exists transaction_hash text;

-- Add checking_status column (optional, but helps distinguish "created" vs "paid, waiting")
-- Let's stick to 'pending' but rely on transaction_hash being NOT NULL as the indicator.

-- Enable UPDATE for investments (Users need to update TX hash)
create policy "Users can update own investments"
on investments for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
