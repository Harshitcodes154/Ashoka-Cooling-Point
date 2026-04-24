/*
# Initial Schema for Ashoka Services

## Query Description: 
This operation creates the foundational tables for the Ashoka Services platform, including profiles, services, and bookings. It sets up Row Level Security (RLS) to ensure data privacy.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Medium"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- public.profiles: Stores user and technician details.
- public.services: Stores appliance categories.
- public.bookings: Stores service requests.

## Security Implications:
- RLS Status: Enabled on all public tables.
- Policy Changes: Yes, basic policies added.
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('customer', 'technician', 'admin');
CREATE TYPE booking_status AS ENUM ('pending', 'accepted', 'in_progress', 'completed', 'cancelled');

-- Create Profiles Table
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    full_name TEXT,
    phone TEXT UNIQUE,
    role user_role DEFAULT 'customer',
    address TEXT,
    skills TEXT[], -- For technicians (e.g., ['AC', 'RO'])
    is_approved BOOLEAN DEFAULT false, -- For technicians
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Services Table
CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2),
    icon_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Bookings Table
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.profiles(id) NOT NULL,
    technician_id UUID REFERENCES public.profiles(id),
    service_category TEXT NOT NULL,
    issue_description TEXT NOT NULL,
    status booking_status DEFAULT 'pending',
    scheduled_date DATE NOT NULL,
    time_slot TEXT NOT NULL,
    service_address TEXT NOT NULL,
    estimated_cost DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (Simplified for MVP)
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Services are viewable by everyone." ON public.services FOR SELECT USING (true);

CREATE POLICY "Customers can view their own bookings." ON public.bookings FOR SELECT USING (auth.uid() = customer_id OR auth.uid() = technician_id);
CREATE POLICY "Customers can create bookings." ON public.bookings FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Insert default services
INSERT INTO public.services (name, category, icon_name) VALUES
('AC Repair & Service', 'AC', 'Wind'),
('Washing Machine Repair', 'Washing Machine', 'Waves'),
('Refrigerator Repair', 'Refrigerator', 'ThermometerSnow'),
('RO Water Purifier', 'RO', 'Droplets'),
('Microwave Repair', 'Microwave', 'Zap');
