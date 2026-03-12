// Tapanta - Categories Data
const CATEGORIES = {
  'Health & Wellness': {
    icon: '🏥',
    subs: {
      'General Physician': '👨‍⚕️',
      'Nutritionist & Dietitian': '🥗',
      'Mental Health Counselor': '🧠',
      'Fitness Trainer': '🏋️',
      'Yoga & Meditation': '🧘',
      'Ayurveda / Homeopathy': '🌿'
    }
  },
  'Career & Education': {
    icon: '💼',
    subs: {
      'Career Coach': '🎯',
      'Resume & Interview Prep': '📝',
      'Study Abroad Consultant': '✈️',
      'Tutor / Academic Help': '📚',
      'Competitive Exam Guide': '🏆'
    }
  },
  'Legal': {
    icon: '⚖️',
    subs: {
      'Civil Lawyer': '📜',
      'Criminal Lawyer': '🔨',
      'Property / Real Estate Law': '🏠',
      'Consumer Rights': '🛡️',
      'Family / Divorce Law': '👨‍👩‍👧'
    }
  },
  'Finance & Tax': {
    icon: '💰',
    subs: {
      'CA / Tax Consultant': '🧾',
      'GST Filing': '📋',
      'Investment Advisor': '📈',
      'Insurance Advisor': '🛡️',
      'Loan & EMI Consultant': '🏦'
    }
  },
  'Technology': {
    icon: '💻',
    subs: {
      'Software Developer': '👨‍💻',
      'Web / App Development': '🌐',
      'Cybersecurity': '🔒',
      'IT Support / Troubleshooting': '🔧',
      'AI / Data Science': '🤖'
    }
  },
  'Business & Startup': {
    icon: '🚀',
    subs: {
      'Business Consultant': '📊',
      'Startup Mentor': '💡',
      'Digital Marketing': '📱',
      'Branding & Design': '🎨',
      'E-commerce Consultant': '🛒'
    }
  },
  'Automotive': {
    icon: '🚗',
    subs: {
      'Car Mechanic': '🔩',
      'Auto Electrician': '⚡',
      'Car AC Technician': '❄️',
      'Tinker & Painting': '🎨',
      'Car Detailing': '✨'
    }
  },
  'Home Services': {
    icon: '🏠',
    subs: {
      'Interior Designer': '🛋️',
      'Civil Engineer / Architect': '📐',
      'Electrician': '💡',
      'Plumber': '🚿',
      'Pest Control': '🐛',
      'Gardening & Landscaping': '🌳'
    }
  },
  'Astrology & Spiritual': {
    icon: '🔮',
    subs: {
      'Astrologer': '⭐',
      'Numerologist': '🔢',
      'Vastu Consultant': '🧭',
      'Tarot Reader': '🃏',
      'Spiritual Guide': '🙏'
    }
  },
  'Relationships & Family': {
    icon: '💑',
    subs: {
      'Relationship Counselor': '❤️',
      'Marriage Counselor': '💍',
      'Parenting Coach': '👶'
    }
  },
  'Creative & Media': {
    icon: '📸',
    subs: {
      'Photographer': '📷',
      'Videographer': '🎥',
      'Content Writer': '✍️',
      'Graphic Designer': '🖌️',
      'Music / Dance Tutor': '🎵'
    }
  }
};

// Get all sub-categories as flat list
function getAllSubCategories() {
  const all = [];
  Object.keys(CATEGORIES).forEach(cat => {
    Object.entries(CATEGORIES[cat].subs).forEach(([sub, icon]) => {
      all.push({ primary: cat, sub: sub, icon: icon, primaryIcon: CATEGORIES[cat].icon });
    });
  });
  return all;
}

// Get icon for any category value (sub-category, primary, or legacy name)
function getSubIcon(catValue) {
  // Exact sub-category match
  for (const [cat, data] of Object.entries(CATEGORIES)) {
    if (data.subs[catValue] !== undefined) return data.subs[catValue];
  }
  // Exact primary category match - return the primary icon
  if (CATEGORIES[catValue]) return CATEGORIES[catValue].icon;
  // Fuzzy: check if catValue partially matches a primary category
  var lv = catValue.toLowerCase();
  for (const [cat, data] of Object.entries(CATEGORIES)) {
    if (cat.toLowerCase().indexOf(lv) !== -1 || lv.indexOf(cat.toLowerCase()) !== -1) return data.icon;
  }
  return '👤';
}

// Resolve any expert category value to its primary category name
// Handles: exact sub match, exact primary match, and fuzzy/legacy names
function resolvePrimary(catValue) {
  if (!catValue) return null;
  // Exact sub-category match
  for (const [cat, data] of Object.entries(CATEGORIES)) {
    if (data.subs[catValue] !== undefined) return cat;
  }
  // Exact primary category match
  if (CATEGORIES[catValue]) return catValue;
  // Fuzzy match for legacy names like "Health & Nutrition" → "Health & Wellness"
  var lv = catValue.toLowerCase();
  for (const [cat] of Object.entries(CATEGORIES)) {
    // Check if first word matches (e.g. "Health" matches "Health & Wellness")
    var firstWord = lv.split(/\s*&\s*/)[0].trim();
    var catFirst = cat.toLowerCase().split(/\s*&\s*/)[0].trim();
    if (firstWord === catFirst) return cat;
  }
  return null;
}

// Find primary category for a sub-category (kept for backward compat)
function getPrimaryCategory(subCat) {
  return resolvePrimary(subCat);
}

// Search categories and sub-categories
function searchCategories(query) {
  if (!query) return [];
  const q = query.toLowerCase();
  const results = [];
  Object.entries(CATEGORIES).forEach(([cat, data]) => {
    if (cat.toLowerCase().includes(q)) {
      Object.entries(data.subs).forEach(([sub, icon]) => {
        results.push({ primary: cat, sub, icon, primaryIcon: data.icon });
      });
    } else {
      Object.entries(data.subs).forEach(([sub, icon]) => {
        if (sub.toLowerCase().includes(q)) {
          results.push({ primary: cat, sub, icon, primaryIcon: data.icon });
        }
      });
    }
  });
  return results;
}
