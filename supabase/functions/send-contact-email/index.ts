const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { name, email, phone, message } = await req.json()

    // Log the contact form submission
    console.log('Contact form submission:', { name, email, phone, message })

    // Send email using Resend (you'll need to set up RESEND_API_KEY in your Supabase environment)
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    const TO_EMAIL = Deno.env.get('CONTACT_EMAIL') || 'ayyavu.ayyavupromoters@gmail.com'

    if (RESEND_API_KEY) {
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'onboarding@resend.dev', // Using Resend's default domain for testing
            to: [TO_EMAIL],
            subject: `New Contact Form Submission from ${name}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">
                  New Contact Form Submission
                </h2>
                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p><strong>Name:</strong> ${name}</p>
                  <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                  <p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
                </div>
                <div style="background-color: #fff; padding: 20px; border-left: 4px solid #dc2626; margin: 20px 0;">
                  <h3 style="color: #374151; margin-top: 0;">Message:</h3>
                  <p style="line-height: 1.6; color: #4b5563;">${message}</p>
                </div>
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                  <p style="color: #6b7280; font-size: 14px;">
                    This email was sent from the Ayyavu Promoters website contact form.
                  </p>
                </div>
              </div>
            `,
          }),
        })

        if (!emailResponse.ok) {
          throw new Error(`Email service error: ${emailResponse.statusText}`)
        }

        console.log('Email sent successfully')
      } catch (emailError) {
        console.error('Failed to send email:', emailError)
        // Don't fail the whole request if email fails
      }
    } else {
      console.log('RESEND_API_KEY not configured, skipping email send')
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Contact form submitted successfully' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})