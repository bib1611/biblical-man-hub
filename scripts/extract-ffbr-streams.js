// Extract FFBR stream URLs from the premium page
// This will help us get the actual stream URLs

const streams = {
  // From the PDF, I can see these premium streams:
  'Premium Holiday Stream': {
    id: 'premium-holiday',
    description: 'Holiday music stream'
  },
  'Premium Music Stream': {
    id: 'premium-music',
    description: 'Christian music 24/7'
  },
  'Premium Preaching Stream': {
    id: 'premium-preaching',
    description: 'Sermon preaching stream'
  },
  'Premium Teaching Stream': {
    id: 'premium-teaching',
    description: 'Biblical teaching stream'
  },
  'Scripture Only Stream': {
    id: 'scripture-only',
    description: 'Scripture reading only'
  },
  'Premium Youth / Kids\' Stream': {
    id: 'premium-youth',
    description: 'Youth and kids content'
  }
};

console.log('Available FFBR Premium Streams:');
console.log(JSON.stringify(streams, null, 2));

// The streams on FFBR appear to use a player that needs authentication
// We'll need to find the direct stream URLs or use their API
