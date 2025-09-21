# Ayyavu Promoters Website

A modern real estate website built with React, TypeScript, and Supabase.

## Features

- **Contact Form**: Visitors can send inquiries that are saved to database and emailed to you
- **Property Listings**: Users can list properties for sale with images and details
- **Property Browsing**: Browse approved properties with contact options
- **User Authentication**: Secure login/signup for property sellers
- **Image Upload**: Property images stored in Supabase storage
- **Responsive Design**: Works on all devices

## Setup Instructions

### 1. Supabase Configuration

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Click "Connect to Supabase" button in the top right of this project
3. The database schema will be automatically created

### 2. Email Notifications Setup (Optional)

To receive email notifications when someone submits the contact form:

1. Sign up for [Resend](https://resend.com) (free tier available)
2. Get your API key from Resend dashboard
3. In your Supabase project, go to Settings > Edge Functions
4. Add these environment variables:
   - `RESEND_API_KEY`: Your Resend API key
   - `CONTACT_EMAIL`: Your email address (defaults to ayyavu.ayyavupromoters@gmail.com)
5. Verify your domain with Resend or use their test domain

### 3. Property Management

- Users must sign up/login to list properties
- All property listings require admin approval before appearing publicly
- To approve properties, access your Supabase dashboard and update the `status` field to 'approved'

### 4. Image Storage

- Property images are automatically stored in Supabase storage
- Maximum 5 images per property
- Images are publicly accessible once uploaded

## How It Works

### Contact Form
1. Visitor fills out contact form
2. Message is saved to `contact_messages` table
3. Email notification is sent to your email (if configured)
4. You can view all messages in Supabase dashboard

### Property Listings
1. User creates account and logs in
2. User submits property with details and images
3. Property is saved with 'pending' status
4. Admin approves property (changes status to 'approved')
5. Property appears on the Properties page
6. Visitors can contact seller via WhatsApp, phone, or email

## Admin Tasks

### Approve Property Listings
1. Go to your Supabase dashboard
2. Navigate to Table Editor > property_listings
3. Find pending properties
4. Change `status` from 'pending' to 'approved'

### View Contact Messages
1. Go to your Supabase dashboard
2. Navigate to Table Editor > contact_messages
3. View all submitted messages

## Development

```bash
npm run dev
```

## Deployment

The site can be deployed to any static hosting service like Netlify, Vercel, or GitHub Pages.