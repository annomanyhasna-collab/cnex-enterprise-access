import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Formatting the name
    const nameParts = data.fullName.trim().split(' ');
    const firstname = nameParts[0];
    const lastname = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        properties: {
          email: data.workEmail,
          firstname: firstname,
          lastname: lastname,
          company: data.companyName,
          jobtitle: data.role,
          // Storing the extra form details in the contact's message/notes
          message: `Company Type: ${data.companyType} | Capacity: ${data.capacity} | Timeline: ${data.timeline} | Workload: ${data.workload} | Region: ${data.region} | NDA: ${data.nda}`
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('HubSpot API Error:', error);
      return NextResponse.json({ success: false, error: 'HubSpot Error' }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
