Frontend should do this:
axios.get('/api/news/123', {
headers: { 'Accept-Language': 'ar' } // This will return Arabic error messages
});
