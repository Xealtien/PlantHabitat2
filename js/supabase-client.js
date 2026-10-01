const SUPABASE_URL = 'https://jfyvxxkhuelpspnihtri.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmeXZ4eGtodWVscHNwbmlodHJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4MDg0NDEsImV4cCI6MjEwNjM4NDQ0MX0.2kjb4AslP-5f6GP-OWklEKf_0ogtlRzhUfhj3WoFIo0';

const supabase = {
  async insertOrder(orderData) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(orderData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to insert order');
    }
    const data = await res.json();
    return data[0] || data;
  },

  async insertInquiry(inquiryData) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/inquiries`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(inquiryData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to insert inquiry');
    }
    const data = await res.json();
    return data[0] || data;
  },

  async getOrders(codes) {
    if (!codes.length) return [];
    const filter = codes.map(c => `code.eq.${encodeURIComponent(c)}`).join(',');
    const res = await fetch(`${SUPABASE_URL}/rest/v1/orders?or=(${filter})`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },

  async submitReview(code, phone, rating, text) {
    const orders = await this.getOrders([code]);
    if (!orders.length) throw new Error('Order not found');
    const order = orders[0];
    
    const res = await fetch(`${SUPABASE_URL}/rest/v1/orders?code=eq.${code}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        review: { rating: parseInt(rating), text, t: Date.now() }
      })
    });
    if (!res.ok) throw new Error('Failed to submit review');
    return res.json();
  }
};
