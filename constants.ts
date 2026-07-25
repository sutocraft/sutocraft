export const COMPANY_INFO = {
  name: "Shafa Abid Automation BD",
  shortName: "Shafa Abid",
  slogan: "Industrial Automation & Electrical Solution",
  phone: "+880 1869-552775",
  whatsapp: "+880 1406-503242",
  majedaWhatsapp: "+880 1740-929666",
  email: "shafaabidautomation.bd@gmail.com",
  address: "Shop No: 01, Cort para, Kumira-4314, Sitakunda, Chattogram, Bangladesh",
  mapLink: "https://maps.app.goo.gl/Yi4jF9y4NtMezPf89",
  facebook: "https://web.facebook.com/profile.php?id=61574697974139",
  wechat: "wxid_sfs46z54x88o22",
  tradeLicense: "05/470",
  bin: "00710xxxx-xxxx",
  coordinates: {
    lat: 22.6167,
    lng: 91.6500
  },
  bankDetails: {
    accountName: "SHAFA ABID AUTOMATION BD",
    accountNumber: "1234567890123456",
    branch: "KHATUNGANJ, CTG",
    bankName: "UNITED COMMERCIAL BANK PLC",
    mobileBanking: "01406503242"
  },
  logoScrollSpeed: 20
};

export const PRICE_RANGE_OPTIONS = [
    '0-100',
    '100-500',
    '500-1000',
    '1000-5000',
    '5000-10000',
    '10000-50000',
    '50000-100000',
    '100000+',
    'Contact for Price'
];

export const DEFAULT_LOGO = ""; 

export const DEFAULT_HERO_CONFIG = {
    title: "FUTURE READY",
    subtitle: "Premier source for industrial automation components and turnkey electrical solutions in Bangladesh.",
    interval: 5,
    productInterval: 1,
    images: [
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2070",
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070",
        "https://images.unsplash.com/photo-1531297461136-82e5a7d2b0e7?auto=format&fit=crop&q=80&w=2070",
        "https://images.unsplash.com/photo-1581092335871-4c8eef2f8e7c?auto=format&fit=crop&q=80&w=2070",
        "https://images.unsplash.com/photo-1581092918056-0c4c3acd5e9f?auto=format&fit=crop&q=80&w=2070"
    ],
    loaderLine1English: "Loading... Please wait...",
    loaderLine2English: "Something new and different is on the way.",
    loaderLineBangla: "নতুন ও ভিন্ন কিছু আসছে। অনুগ্রহ করে অপেক্ষা করুন।",
    loaderBrandText: "Shafa Abid Automation BD",
    heroTitleEnglish: "OCEAN OF AUTOMATION PARTS & PRODUCTS",
    heroTitleEnglishColor: "#FFFFFF",
    heroTitleEnglishSize: "text-2xl sm:text-5xl md:text-7xl",
    heroTitleBangla: "অটোমেশন পার্টস ও ইন্ডাস্ট্রিয়াল প্রোডাক্টসের মহাসাগর",
    heroTitleBanglaColor: "#FF5722",
    heroTitleBanglaSize: "text-xl sm:text-3xl md:text-4xl",
    heroSubtitleEnglish: "Your trusted source for industrial automation components and electrical solutions in Bangladesh.",
    heroSubtitleEnglishColor: "#FF5722",
    heroSubtitleEnglishSize: "text-base sm:text-xl",
    heroSubtitleBangla: "বাংলাদেশের জন্য নির্ভরযোগ্য ইন্ডাস্ট্রিয়াল অটোমেশন কম্পোনেন্টস ও ইলেকট্রিক্যাল সলিউশনের উৎস।",
    heroSubtitleBanglaColor: "#CBD5E1",
    heroSubtitleBanglaSize: "text-sm sm:text-lg"
};

export const STOCK_STATUS_OPTIONS = [
    { value: 'in-stock', label: 'IN STOCK', color: 'bg-green-500' },
    { value: '7-15-days', label: '7-15 DAYS', color: 'bg-orange-500' },
    { value: '15-30-days', label: '15-30 DAYS', color: 'bg-orange-500' },
    { value: '30-45-days', label: '30-45 DAYS', color: 'bg-orange-500' },
    { value: 'out-of-stock', label: 'OUT OF STOCK', color: 'bg-red-500' }
];

export const LEAD_TIME_OPTIONS = [
    '1-3 days',
    '7-15 days',
    '15-30 days', 
    '30-45 days',
    '45-60 days',
    '2-3 months',
    '3-4 months',
    '4-6 months',
    'Contact for exact timeline'
];

export const WARRANTY_OPTIONS = [
    'No Warranty',
    '3 months',
    '6 months',
    '1 year'
];

export const WARRANTY_TERMS: Record<string, string> = {
    '3 months': 'Warranty applicable for 3 months in case of manufacture defect, low quality of product. Warranty not applicable for physical damage and due to short circuit by User.',
    '6 months': 'Warranty applicable for 6 months in case of manufacture defect, low quality of product. Warranty not applicable for physical damage and due to short circuit by User.',
    '1 year': 'Warranty applicable for 1 year in case of manufacture defect, low quality of product. Warranty not applicable for physical damage and due to short circuit by User.'
};

export const REFUND_POLICY = 'Refund Policy: When products are low quality, broken by our team, or wrong products then refund within 4 hours, but must need proofed by pictures, unboxing videos provided in our customer care WhatsApp. Otherwise refund not provided from our side.';

export const BANK_TRANSFER_TERMS = 'For Bank Transfer: We will provide Mushak-6.3. You must provide Mushak-6.6 with VDS & TDS Challan copy after delivery.';

export const DEFAULT_ORIGIN_OPTIONS = ['China', 'India', 'Germany', 'USA', 'Japan', 'South Korea', 'Italy', 'UK', 'Taiwan', 'Other'];

export const COURIER_PLATFORMS = [
    { id: 'paperfly', name: 'PaperFly', url: 'https://www.17track.net/en/carriers/paperfly?nums=' },
    { id: 'steadfast', name: 'SteadFast', url: 'https://steadfast.com.bd/tracking/' },
    { id: 'redx', name: 'REDX BD', url: 'https://redx.com.bd/tracking/' },
    { id: 'pathao', name: 'Pathao', url: 'https://pathao.com/courier/track/' },
    { id: 'sundarban', name: 'Sundarban Courier', url: 'https://tracking.sundarbancourierltd.com/?cnnumber=' }
];

export const CONDITION_OPTIONS = ['Brand New', 'Refurbished', 'Second-hand', 'Ship Used', 'Reconditioned', 'Factory Sealed'];

export const PAYMENT_NOTIFICATIONS: Record<string, string> = {
    cod: "✓ Cash on Delivery - Pay when you receive the products (No AIT/VAT applicable)",
    bkash: "📱 Please send payment to " + COMPANY_INFO.bankDetails.mobileBanking + " (bKash) and submit transaction ID. For assistance, WhatsApp us at +880 1406-503242",
    nagad: "📱 Please send payment to " + COMPANY_INFO.bankDetails.mobileBanking + " (Nagad) and submit transaction ID. For assistance, WhatsApp us at +880 1406-503242",
    rocket: "📱 Please send payment to " + COMPANY_INFO.bankDetails.mobileBanking + " (Rocket) and submit transaction ID. For assistance, WhatsApp us at +880 1406-503242",
    bank: "🏦 " + BANK_TRANSFER_TERMS + " Pay to: " + COMPANY_INFO.bankDetails.accountName + " - A/C: " + COMPANY_INFO.bankDetails.accountNumber + " - " + COMPANY_INFO.bankDetails.bankName + " - Branch: " + COMPANY_INFO.bankDetails.branch + " | WhatsApp: +880 1406-503242",
    card: "💳 Please make payment via our secure payment gateway. For assistance, WhatsApp us at +880 1406-503242"
};

export const BANGLADESH_LOCATIONS: Record<string, string[]> = {
    'Dhaka': ['Adabor', 'Badda', 'Bangshal', 'Bimanbandar', 'Cantonment', 'Chawkbazar', 'Dakshinkhan', 'Darus Salam', 'Demra', 'Dhanmondi', 'Gendaria', 'Gulshan', 'Hazaribagh', 'Jatrabari', 'Kadamtali', 'Kafrul', 'Kalabagan', 'Kamrangirchar', 'Khilgaon', 'Khilkhet', 'Kotwali', 'Lalbagh', 'Mirpur', 'Mohammadpur', 'Motijheel', 'Mugda', 'New Market', 'Pallabi', 'Paltan', 'Ramna', 'Rampura', 'Sabujbagh', 'Shah Ali', 'Shahbagh', 'Sher-e-Bangla Nagar', 'Shyampur', 'Sutrapur', 'Tejgaon', 'Turag', 'Uttara', 'Vasantek', 'Wari'],
    'Chattogram': ['Akbar Shah', 'Bakalia', 'Bandar', 'Bayazid Bostami', 'Chandgaon', 'Chawkbazar', 'Double Mooring', 'EPZ', 'Halishahar', 'Karnaphuli', 'Khulshi', 'Kotwali', 'Pahartali', 'Panchlaish', 'Patenga', 'Sadarghat', 'Anwara', 'Banshkhali', 'Boalkhali', 'Chandanaish', 'Fatikchhari', 'Hathazari', 'Lohagara', 'Mirsharai', 'Patiya', 'Rangunia', 'Raozan', 'Sandwip', 'Satkania', 'Sitakunda'],
    'Gazipur': ['Gazipur Sadar', 'Kaliakair', 'Kaliganj', 'Kapasia', 'Sreepur'],
    'Narayanganj': ['Araihazar', 'Bandar', 'Narayanganj Sadar', 'Rupganj', 'Sonargaon'],
    'Sylhet': ['Balaganj', 'Beanibazar', 'Bishwanath', 'Companiganj', 'Dakshin Surma', 'Fenchuganj', 'Golapganj', 'Gowainghat', 'Jaintiapur', 'Kanaighat', 'Osmani Nagar', 'Sylhet Sadar', 'Zakiganj'],
    'Khulna': ['Batiaghata', 'Dacope', 'Dumuria', 'Dighalia', 'Koyra', 'Paikgacha', 'Phultala', 'Rupsha', 'Terokhada'],
    'Rajshahi': ['Bagha', 'Bagmara', 'Charghat', 'Durgapur', 'Godagari', 'Mohanpur', 'Paba', 'Puthia', 'Tanore'],
    'Barishal': ['Agailjhara', 'Babuganj', 'Bakerganj', 'Banaripara', 'Gaurnadi', 'Hizla', 'Mehendiganj', 'Muladi', 'Wazirpur'],
    'Rangpur': ['Badarganj', 'Gangachhara', 'Kaunia', 'Mithapukur', 'Pirgachha', 'Pirganj', 'Rangpur Sadar', 'Taraganj'],
    'Mymensingh': ['Bhaluka', 'Dhobaura', 'Fulbaria', 'Gaffargaon', 'Gauripur', 'Haluaghat', 'Ishwarganj', 'Muktagachha', 'Mymensingh Sadar', 'Nandail', 'Phulpur', 'Trishal'],
    'Comilla': ['Barura', 'Brahmanpara', 'Burichang', 'Chandina', 'Chauddagram', 'Daudkandi', 'Debidwar', 'Homna', 'Laksam', 'Lalmai', 'Meghna', 'Monohorgonj', 'Muradnagar', 'Nangalkot', 'Titas'],
    'Bogra': ['Adamdighi', 'Bogra Sadar', 'Dhunat', 'Dupchanchia', 'Gabtali', 'Kahaloo', 'Nandigram', 'Sariakandi', 'Shajahanpur', 'Sherpur', 'Shibganj', 'Sonatola'],
    'Other': ['Other']
};

export const INITIAL_BRANDS = [
    { id: 'b1111111-1111-4111-a111-111111111111', name: 'abcd', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Siemens-logo.svg' },
    { id: 'b2222222-2222-4222-a222-222222222222', name: 'abcd', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/00/ABB_logo.svg' },
    { id: 'b3333333-3333-4333-a333-333333333333', name: 'abcd', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Schneider_Electric_2007.svg' },
    { id: 'b4444444-4444-4444-a444-444444444444', name: 'abcd', logo: 'https://www.ibersystem.com/wp-content/uploads/2025/03/Logo-PHOENIX-Transp-900x300-1.png' },
    { id: 'b5555555-5555-4555-a555-555555555555', name: 'abcd', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Omron_logo.svg' },
    { id: 'b6666666-6666-4666-a666-666666666666', name: 'abcd', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Mitsubishi_Electric_logo.png' },
    { id: 'b7777777-7777-4777-a777-777777777777', name: 'abcd', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Wago-logo.png' },
    { id: 'b8888888-8888-4888-a888-888888888888', name: 'abcd', logo: 'https://www.controldesignonline.com/includes/work/image_cache/webp/6df323a49cde13a9450c299871266c67.thumb.webp' }
];

export const INITIAL_PRODUCTS = [
  { id: 'a1111111-1111-4111-a111-111111111111', name: 'abcd', brand: 'abcd', origin: 'abcd', category: 'abcd', image: 'https://images.unsplash.com/photo-1590959651373-a3db0f38a961?auto=format&fit=crop&q=80&w=400', stockStatus: 'in-stock', price: 1234, description: 'abcd', datasheet: null, minQty: 1 },
  { id: 'a2222222-2222-4222-a222-222222222222', name: 'abcd', brand: 'abcd', origin: 'abcd', category: 'abcd', image: 'https://images.unsplash.com/photo-1618764400608-9e7115e37341?auto=format&fit=crop&q=80&w=400', stockStatus: '15-30-days', price: 1234, description: 'abcd', leadTime: '15-30 days', datasheet: null, minQty: 1 },
  { id: 'a3333333-3333-4333-a333-333333333333', name: 'abcd', brand: 'abcd', origin: 'abcd', category: 'abcd', image: 'https://images.unsplash.com/photo-1558486012-817176f84c6d?auto=format&fit=crop&q=80&w=400', stockStatus: 'in-stock', price: 1234, description: 'abcd', datasheet: null, minQty: 5 },
  { id: 'a4444444-4444-4444-a444-444444444444', name: 'abcd', brand: 'abcd', origin: 'abcd', category: 'abcd', image: 'https://images.unsplash.com/photo-1619623631988-c750b3f57285?auto=format&fit=crop&q=80&w=400', stockStatus: 'out-of-stock', price: 1234, description: 'abcd', datasheet: null, minQty: 1 },
  { id: 'a5555555-5555-4555-a555-555555555555', name: 'abcd', brand: 'abcd', origin: 'abcd', category: 'abcd', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=400', stockStatus: '30-45-days', price: 1234, description: 'abcd', leadTime: '30-45 days', datasheet: null, minQty: 1 },
  { id: 'a6666666-6666-4666-a666-666666666666', name: 'abcd', brand: 'abcd', origin: 'abcd', category: 'abcd', image: 'https://images.unsplash.com/photo-1619623631988-c750b3f57285?auto=format&fit=crop&q=80&w=400', stockStatus: 'in-stock', price: 1234, description: 'abcd', datasheet: null, minQty: 10 },
  { id: 'a7777777-7777-4777-a777-777777777777', name: 'abcd', brand: 'abcd', origin: 'abcd', category: 'abcd', image: 'https://images.unsplash.com/photo-1590959651373-a3db0f38a961?auto=format&fit=crop&q=80&w=400', stockStatus: 'in-stock', price: 1234, description: 'abcd', datasheet: null, minQty: 1 },
  { id: 'a8888888-8888-4888-a888-888888888888', name: 'abcd', brand: 'abcd', origin: 'abcd', category: 'abcd', image: 'https://images.unsplash.com/photo-1558486012-817176f84c6d?auto=format&fit=crop&q=80&w=400', stockStatus: 'in-stock', price: 1234, description: 'abcd', datasheet: null, minQty: 10 },
  { id: 'a9999999-9999-4999-a999-999999999999', name: 'abcd', brand: 'abcd', origin: 'abcd', category: 'abcd', image: 'https://images.unsplash.com/photo-1618764400608-9e7115e37341?auto=format&fit=crop&q=80&w=400', stockStatus: '7-15-days', price: 1234, description: 'abcd', leadTime: '7-15 days', datasheet: null, minQty: 1 },
  { id: 'a0000000-0000-4000-a000-000000000000', name: 'abcd', brand: 'abcd', origin: 'abcd', category: 'abcd', image: 'https://images.unsplash.com/photo-1619623631988-c750b3f57285?auto=format&fit=crop&q=80&w=400', stockStatus: 'in-stock', price: 1234, description: 'abcd', datasheet: null, minQty: 20 }
];

export const INITIAL_COMPANY_PHILOSOPHY = [
    { id: 'c1111111-1111-4111-a111-111111111111', title: 'abcd', description: 'abcd', icon: 'Shield' },
    { id: 'c2222222-2222-4222-a222-222222222222', title: 'abcd', description: 'abcd', icon: 'Users' },
    { id: 'c3333333-3333-4333-a333-333333333333', title: 'abcd', description: 'abcd', icon: 'Globe' },
    { id: 'c4444444-4444-4444-a444-444444444444', title: 'abcd', description: 'abcd', icon: 'Award' }
];

export const INITIAL_PARTNER_MERCHANTS = [
    { id: 'c1111111-1111-4111-a111-111111111111', name: 'abcd' },
    { id: 'c2222222-2222-4222-a222-222222222222', name: 'abcd' },
    { id: 'c3333333-3333-4333-a333-333333333333', name: 'abcd' },
    { id: 'c4444444-4444-4444-a444-444444444444', name: 'abcd' },
    { id: 'c5555555-5555-4555-a555-555555555555', name: 'abcd' },
    { id: 'c6666666-6666-4666-a666-666666666666', name: 'abcd' },
    { id: 'c7777777-7777-4777-a777-777777777777', name: 'abcd' },
    { id: 'c8888888-8888-4888-a888-888888888888', name: 'abcd' },
    { id: 'c9999999-9999-4999-a999-999999999999', name: 'abcd' },
    { id: 'c0000000-0000-4000-a000-000000000000', name: 'abcd' }
];

export const INITIAL_SPECIALIZED_SERVICES = [
    { id: 'd1111111-1111-4111-a111-111111111111', title: 'abcd', description: 'abcd', image: 'https://picsum.photos/seed/panel/800/600' },
    { id: 'd2222222-2222-4222-a222-222222222222', title: 'abcd', description: 'abcd', image: 'https://picsum.photos/seed/pcb/800/600' }
];

export const INITIAL_LICENSES = [
    { id: 'e1111111-1111-4111-a111-111111111111', image: 'https://picsum.photos/seed/license1/400/600' },
    { id: 'e2222222-2222-4222-a222-222222222222', image: 'https://picsum.photos/seed/license2/400/600' },
    { id: 'e3333333-3333-4333-a333-333333333333', image: 'https://picsum.photos/seed/license3/400/600' },
    { id: 'e4444444-4444-4444-a444-444444444444', image: 'https://picsum.photos/seed/license4/400/600' }
];

export const INITIAL_ADVANTAGES = {
    description: 'abcd',
    points: [
        'abcd',
        'abcd',
        'abcd',
        'abcd'
    ]
};

export const INITIAL_TEAM_MEMBERS = [
    {
        id: 'f1111111-1111-4111-a111-111111111111',
        name: 'abcd',
        designation: 'Proprietor',
        email: 'abcd@example.com',
        phone: '1234',
        details: 'abcd',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400'
    },
    {
        id: 'f2222222-2222-4222-a222-222222222222',
        name: 'abcd',
        designation: 'abcd',
        email: 'abcd@example.com',
        phone: '1234',
        details: 'abcd',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400'
    },
    {
        id: 'f3333333-3333-4333-a333-333333333333',
        name: 'abcd',
        designation: 'abcd',
        email: 'abcd@example.com',
        phone: '1234',
        details: 'abcd',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400'
    }
];

export const INITIAL_CUSTOMERS = [
    { id: 'c1111111-1111-4111-a111-111111111111', name: 'abcd', logo: 'https://picsum.photos/seed/bashundhara/200/200', details: 'abcd' },
    { id: 'c2222222-2222-4222-a222-222222222222', name: 'abcd', logo: 'https://picsum.photos/seed/akij/200/200', details: 'abcd' },
    { id: 'c3333333-3333-4333-a333-333333333333', name: 'abcd', logo: 'https://picsum.photos/seed/pran/200/200', details: 'abcd' },
    { id: 'c4444444-4444-4444-a444-444444444444', name: 'abcd', logo: 'https://picsum.photos/seed/square/200/200', details: 'abcd' },
    { id: 'c5555555-5555-4555-a555-555555555555', name: 'abcd', logo: 'https://picsum.photos/seed/bsrm/200/200', details: 'abcd' }
];

export const SERVICES = [
    { id: 'f1111111-1111-4111-a111-111111111111', icon: "fa-project-diagram", title: "abcd", description: "abcd", image: "https://picsum.photos/seed/panel/800/600" },
    { id: 'f2222222-2222-4222-a222-222222222222', icon: "fa-microchip", title: "abcd", description: "abcd", image: "https://picsum.photos/seed/plc/800/600" },
    { id: 'f3333333-3333-4333-a333-333333333333', icon: "fa-tools", title: "abcd", description: "abcd", image: "https://picsum.photos/seed/maintenance/800/600" },
    { id: 'f4444444-4444-4444-a444-444444444444', icon: "fa-chart-line", title: "abcd", description: "abcd", image: "https://picsum.photos/seed/energy/800/600" },
    { id: 'f5555555-5555-4555-a555-555555555555', icon: "fa-robot", title: "abcd", description: "abcd", image: "https://picsum.photos/seed/robotics/800/600" },
    { id: 'f6666666-6666-4666-a666-666666666666', icon: "fa-graduation-cap", title: "abcd", description: "abcd", image: "https://picsum.photos/seed/training/800/600" }
];

export const INITIAL_REFERENCE_PICTURES = [
    { id: 'r1', image: 'https://picsum.photos/seed/ref1/800/600', details: 'abcd' },
    { id: 'r2', image: 'https://picsum.photos/seed/ref2/800/600', details: 'abcd' },
    { id: 'r3', image: 'https://picsum.photos/seed/ref3/800/600', details: 'abcd' },
    { id: 'r4', image: 'https://picsum.photos/seed/ref4/800/600', details: 'abcd' }
];
