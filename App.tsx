import { supabase } from './lib/supabase';
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Routes, Route, useLocation, useNavigate, useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import LogoScroller from './components/LogoScroller';
import { ReferencePictures } from './components/ReferencePictures';
import Footer from './components/Footer';
import PaymentMethods from './components/PaymentMethods';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import AboutUs from './components/AboutUs';
import ProductDetail from './components/ProductDetail';
const Home = React.lazy(() => import('./pages/Home'));
const Products = React.lazy(() => import('./pages/Products'));
const Contact = React.lazy(() => import('./pages/Contact'));
const About = React.lazy(() => import('./pages/About'));
const Reference = React.lazy(() => import('./pages/Reference'));
const Services = React.lazy(() => import('./pages/Services'));
import ContactForm from './components/ContactForm';
import QueryForm from './components/QueryForm';
import { QRCodeCanvas } from 'qrcode.react';
import CustomerAuthModal from './components/CustomerAuthModal';
import CustomerDashboardModal from './components/CustomerDashboardModal';
import EditProfileModal from './components/EditProfileModal';

import { Toaster, toast } from 'sonner';
import { 
    Search, Package, Send, HelpCircle, 
    ChevronRight, ChevronLeft, Star, Shield, 
    Truck, Clock, CheckCircle2, AlertCircle,
    Menu, X, Phone, Mail, MapPin,
    Facebook, Instagram, Linkedin, Twitter,
    ArrowRight, Download, ExternalLink,
    Filter, LayoutGrid, List,
    FileText, ShoppingCart
} from 'lucide-react';

import { 
    COMPANY_INFO, INITIAL_PRODUCTS, INITIAL_BRANDS, SERVICES, 
    DEFAULT_LOGO, DEFAULT_HERO_CONFIG, DEFAULT_ORIGIN_OPTIONS,
    PAYMENT_NOTIFICATIONS, WARRANTY_TERMS, REFUND_POLICY,
    BANGLADESH_LOCATIONS, CONDITION_OPTIONS,
    LEAD_TIME_OPTIONS, WARRANTY_OPTIONS, BANK_TRANSFER_TERMS,
    INITIAL_COMPANY_PHILOSOPHY, INITIAL_PARTNER_MERCHANTS, INITIAL_SPECIALIZED_SERVICES, INITIAL_LICENSES,
    INITIAL_ADVANTAGES, INITIAL_TEAM_MEMBERS, INITIAL_CUSTOMERS, INITIAL_REFERENCE_PICTURES
} from './constants';
import { Product, User, Query, CompanyPhilosophy, PartnerMerchant, SpecializedService, License, AdvantageData, TeamMember, Customer, ReferencePicture, TechnicalServiceProvider } from './types';
import { formatWhatsAppNumber, generateId, ensureValidUuid } from './utils/helpers';
import { getSupabaseItem, setSupabaseItem, deleteSupabaseItem, testSupabaseConnection, camelToSnake } from './utils/supabaseStore';

import { resizeImage } from './utils/image';
// import L from 'leaflet';

const App: React.FC = () => {
    const checkAdminAccess = async (email?: string | null) => {
    if (!email) return false;

    const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email.toLowerCase())
        .eq('status', 'active')
        .maybeSingle();

    if (error) {
        console.error('Admin access check error:', error);
        return false;
    }

    return !!data;
};
    // --- STATE ---
    const [isAdmin, setIsAdmin] = useState(false);
    const [customerSession, setCustomerSession] = useState<any>(null);
    const [customerProfile, setCustomerProfile] = useState<any>(null);
    const [showCustomerDashboard, setShowCustomerDashboard] = useState(false);
    const [showEditProfileModal, setShowEditProfileModal] = useState(false);
    const [showCustomerAuthModal, setShowCustomerAuthModal] = useState(false);
    const [pendingCustomerAction, setPendingCustomerAction] = useState<(() => void) | null>(null);

    // --- AUTH STATE ---
useEffect(() => {
    const handleAuthError = (err: any) => {
        if (
            err?.message?.includes('Refresh Token Not Found') ||
            err?.message?.includes('invalid_refresh_token')
        ) {
            console.warn("Auth session invalid. Clearing session...");
            supabase.auth.signOut().catch(() => {});
            setIsAdmin(false);
            localStorage.removeItem('admin_auth');

            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
                    localStorage.removeItem(key);
                }
            }
        }
    };

    supabase.auth.getSession().then(({ data: { session }, error }) => {
        if (error) {
            console.error("Error getting session:", error);
            handleAuthError(error);
            return;
        }

        checkAdminAccess(session?.user?.email).then((allowed) => {
            if (allowed) {
                setIsAdmin(true);
                localStorage.setItem('admin_auth', 'true');
            } else {
                setIsAdmin(false);
                localStorage.removeItem('admin_auth');
            }
        });
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth event:', event);

        if (event === 'TOKEN_REFRESHED') {
            console.log('Token refreshed successfully');
        }

        if (event === 'SIGNED_OUT') {
            setIsAdmin(false);
            localStorage.removeItem('admin_auth');
            return;
        }

        checkAdminAccess(session?.user?.email).then((allowed) => {
            if (allowed) {
                setIsAdmin(true);
                localStorage.setItem('admin_auth', 'true');
            } else {
                setIsAdmin(false);
                localStorage.removeItem('admin_auth');
            }
        });
    });

    return () => subscription.unsubscribe();
}, []);

   useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
        setCustomerSession(data.session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setCustomerSession(session);
    });

    return () => subscription.unsubscribe();
}, []);

useEffect(() => {
    const loadCustomerProfile = async () => {
        if (!customerSession?.user?.id) {
            setCustomerProfile(null);
            return;
        }

        const { data, error } = await supabase
            .from('customer_profiles')
            .select('*')
            .eq('id', customerSession.user.id)
            .maybeSingle();

        if (error) {
            console.error('Customer profile load error:', error);
            setCustomerProfile(null);
            return;
        }

        setCustomerProfile(data);
    };

    loadCustomerProfile();
}, [customerSession]);

    
    const contactFormRef = useRef<HTMLFormElement>(null);
    const [adminTab, setAdminTab] = useState('products');
    const [adminView, setAdminView] = useState('list');
    
    const [activeSection, _setActiveSection] = useState('home');
    const location = useLocation();
    const navigate = useNavigate();
    const isAdminMode = location.pathname === '/admin';

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    useEffect(() => {
        const path = location.pathname.split('/')[1] || 'home';
        if (['home', 'products', 'services', 'reference', 'about', 'contact'].includes(path)) {
            _setActiveSection(path);
        }
    }, [location]);

    const setActiveSection = (section: string) => {
        if (section === 'home') {
            navigate('/');
        } else {
            navigate(`/${section}`);
        }
        window.scrollTo(0, 0);
    };

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const [teamMembers, setTeamMembers] = useState<TeamMember[]>(INITIAL_TEAM_MEMBERS);
    const [technicalServices, setTechnicalServices] = useState<TechnicalServiceProvider[]>([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    
    const [logo, setLogo] = useState<string>(DEFAULT_LOGO);
    const [companyInfo, setCompanyInfo] = useState(COMPANY_INFO);
    const [heroConfig, setHeroConfig] = useState(DEFAULT_HERO_CONFIG);
    
    const [products, setProducts] = useState<Product[]>([]);
    const [brands, setBrands] = useState<any[]>([]);
    const [originOptions, setOriginOptions] = useState<string[]>(DEFAULT_ORIGIN_OPTIONS);
    const [certificates, setCertificates] = useState({ tradeLicense: '', bin: '' });
    const [qrCodes, setQrCodes] = useState({ facebook: '', googleMaps: '', wechat: '' });
    const [companyProfile, setCompanyProfile] = useState<string>('');
    const [messages, setMessages] = useState<any[]>([]);
    const [contactPictures, setContactPictures] = useState<string[]>(['', '', '']);
    const [contactSuccessMessage, setContactSuccessMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [queries, setQueries] = useState<Query[]>([]);

    const customerQueries = queries.filter((q: any) =>
    q.customerId === customerSession?.user?.id ||
    q.customerEmail === customerSession?.user?.email);

    const [services, setServices] = useState<any[]>(SERVICES);
    const [companyPhilosophy, setCompanyPhilosophy] = useState<CompanyPhilosophy[]>(INITIAL_COMPANY_PHILOSOPHY);
    const [partnerMerchants, setPartnerMerchants] = useState<PartnerMerchant[]>(INITIAL_PARTNER_MERCHANTS);
    const [specializedServices, setSpecializedServices] = useState<SpecializedService[]>(INITIAL_SPECIALIZED_SERVICES);
    const [licenses, setLicenses] = useState<License[]>(INITIAL_LICENSES);
    const [advantages, setAdvantages] = useState<AdvantageData>(INITIAL_ADVANTAGES);
    const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
    const [referencePictures, setReferencePictures] = useState<ReferencePicture[]>(INITIAL_REFERENCE_PICTURES);
    const [showQueryModal, setShowQueryModal] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isFullyLoaded, setIsFullyLoaded] = useState(false);
    const loadedKeysRef = useRef<Set<string>>(new Set());
    const [loadProgress, setLoadProgress] = useState(5);

    useEffect(() => {
        console.log(`[Loading] isLoaded: ${isLoaded}, Progress: ${loadProgress}%`);
    }, [loadProgress, isLoaded]);

    // --- INITIAL DATA LOAD ---
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (!isLoaded) {
                console.warn("Loading safety timeout reached (60s), forcing isLoaded = true");
                setIsLoaded(true);
                setLoadProgress(100);
            }
        }, 60000);

        const loadData = async () => {
            console.log("Starting loadData...");
            try {
                let cachedData = null;
                try {
                    cachedData = localStorage.getItem('sa_automation_cache');
                } catch (e) {
                    console.warn("LocalStorage access failed", e);
                }

                if (cachedData) {
                    console.log("Found cached data");
                    try {
                        const parsed = JSON.parse(cachedData);
                        if (parsed.logo) setLogo(parsed.logo);
                        if (parsed.companyInfo) setCompanyInfo(parsed.companyInfo);
                        if (parsed.heroConfig) setHeroConfig(parsed.heroConfig);
                        if (parsed.brands) setBrands(parsed.brands);
                    } catch (e) {
                        console.error("Cache parse error", e);
                    }
                }

                const essentialKeys = ['logo', 'companyInfo', 'heroConfig'];
                console.log("[Loading] Starting essential data fetch...");
                
                const essentialResults: any = {};
                await Promise.all(essentialKeys.map(async (key) => {
                    try {
                        console.log(`[Loading] Fetching ${key}...`);
                        const data = await getSupabaseItem(key);
                        console.log(`[Loading] Data for ${key}:`, data);
                        essentialResults[key] = data;
                        loadedKeysRef.current.add(key);
                        console.log(`[Loading] Successfully fetched ${key}`);
                        setLoadProgress(prev => Math.min(prev + 25, 95));
                    } catch (err) {
                        console.error(`[Loading] Error fetching essential ${key}:`, err);
                    }
                }));

                // ========== লোগো লোডিং (ক্যাশ + রেট্রাই সহ) ==========
                const cachedLogo = localStorage.getItem('sa_logo');
                if (essentialResults.logo) {
                    setLogo(essentialResults.logo);
                    localStorage.setItem('sa_logo', essentialResults.logo);
                } else if (cachedLogo) {
                    console.log("[Loading] Using cached logo");
                    setLogo(cachedLogo);
                } else {
                    setLogo(DEFAULT_LOGO);
                }
                // =====================================================
                
                if (essentialResults.companyInfo) {
                    setCompanyInfo({ 
                        ...COMPANY_INFO, 
                        ...essentialResults.companyInfo,
                        bankDetails: essentialResults.companyInfo.bankDetails || COMPANY_INFO.bankDetails
                    });
                } else {
                    setCompanyInfo(COMPANY_INFO);
                }

                if (essentialResults.heroConfig) {
                    setHeroConfig({ 
                        ...DEFAULT_HERO_CONFIG, 
                        ...essentialResults.heroConfig,
                        images: (essentialResults.heroConfig.images && essentialResults.heroConfig.images.length > 0) 
                            ? essentialResults.heroConfig.images 
                            : DEFAULT_HERO_CONFIG.images
                    });
                } else {
                    setHeroConfig(DEFAULT_HERO_CONFIG);
                }

                setIsLoaded(true);
                setLoadProgress(100);
                console.log("[Loading] Essential data loaded. App is now visible.");
                clearTimeout(timeoutId);

                const remainingKeys = [
                    'companyProfile', 'brands', 'products', 'originOptions', 'certificates', 'qrCodes', 
                    'messages', 'queries', 'services', 'companyPhilosophy_v2', 
                    'partnerMerchants_v2', 'specializedServices_v2', 'licenses_v2', 'advantages', 
                    'teamMembers', 'customers', 'referencePictures'
                ];

                await Promise.all(remainingKeys.map(async (key) => {
                    try {
                        const data = await getSupabaseItem(key);
                        if (data !== null && data !== undefined) loadedKeysRef.current.add(key);
                        
                        if (key === 'companyProfile') setCompanyProfile(data || '');
                        if (key === 'brands') setBrands(data !== null ? data : INITIAL_BRANDS);
                        if (key === 'products') setProducts(data !== null ? data : INITIAL_PRODUCTS);
                        if (key === 'originOptions' && Array.isArray(data)) setOriginOptions(data !== null ? data : DEFAULT_ORIGIN_OPTIONS);
                        if (key === 'customers' && Array.isArray(data)) setCustomers(data !== null ? data : INITIAL_CUSTOMERS);
                        if (key === 'certificates' && data) setCertificates(data);
                        if (key === 'qrCodes' && data) setQrCodes(data);
                        if (key === 'messages' && Array.isArray(data)) setMessages(data);
                        if (key === 'queries' && Array.isArray(data)) setQueries(data);
                        if (key === 'services' && Array.isArray(data)) setServices(data);
                        if (key === 'companyPhilosophy_v2' && Array.isArray(data)) setCompanyPhilosophy(data);
                        if (key === 'partnerMerchants_v2' && Array.isArray(data)) setPartnerMerchants(data);
                        if (key === 'specializedServices_v2' && Array.isArray(data)) setSpecializedServices(data);
                        if (key === 'licenses_v2' && Array.isArray(data)) setLicenses(data);
                        if (key === 'advantages' && data) {
                            setAdvantages({ 
                                description: data.description || INITIAL_ADVANTAGES.description,
                                points: Array.isArray(data.points) ? data.points : INITIAL_ADVANTAGES.points
                            });
                        }
                        if (key === 'teamMembers' && Array.isArray(data)) setTeamMembers(data !== null ? data : INITIAL_TEAM_MEMBERS);
                        if (key === 'referencePictures' && Array.isArray(data)) setReferencePictures(data !== null ? data : INITIAL_REFERENCE_PICTURES);
                    } catch (err) {
                        console.error(`Error background loading ${key}:`, err);
                    }
                }));

                try {
                    const { data: techData, error: techError } = await supabase
                        .from('technical_service_providers')
                        .select('*')
                        .order('display_order', { ascending: true });

                        if (techError) {
                console.error('Error loading technical service providers:', techError);
                        } else {
                        setTechnicalServices(techData || []);
                        }
                } catch (error) {
                console.error('Technical service providers loading failed:', error);
                }

                console.log("Background loading complete.");

                try {
                    const cacheObj = {
                        logo: essentialResults.logo,
                        companyInfo: essentialResults.companyInfo,
                        heroConfig: essentialResults.heroConfig
                    };
                    localStorage.setItem('sa_automation_cache', JSON.stringify(cacheObj));
                } catch (e) {
                    localStorage.removeItem('sa_automation_cache');
                }
                
                setIsFullyLoaded(true);

            } catch (error) {
                console.error("Critical load error:", error);
                setProducts(INITIAL_PRODUCTS);
                setTimeout(() => {
                    setIsLoaded(true);
                    setIsFullyLoaded(true);
                }, 1000);
                clearTimeout(timeoutId);
            }
        };
        loadData();
        return () => clearTimeout(timeoutId);
    }, []);

    // --- DATA PERSISTENCE (অটো-সেইভ) ---
    useEffect(() => {
        if (!isFullyLoaded || !isAdmin) return;
        const timeoutId = setTimeout(() => {
            const saveData = async () => {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error || !session) {
                    console.log("[Auto-save] Skipping save: User is not authenticated or session error.", error);
                    if (error) {
                        supabase.auth.signOut();
                        setIsAdmin(false);
                        localStorage.removeItem('admin_auth');
                    }
                    return;
                }

                try {
                    const savePromises = [];
                    const loadedKeys = loadedKeysRef.current;
                    
                    if (loadedKeys.has('products')) {
    const safeProducts = await mergeProductsWithRemoteMedia(products);
    savePromises.push(setSupabaseItem('products', safeProducts));
}
                    if (loadedKeys.has('brands')) savePromises.push(setSupabaseItem('brands', brands));
                    if (loadedKeys.has('originOptions')) savePromises.push(setSupabaseItem('originOptions', originOptions));
                    if (loadedKeys.has('certificates')) savePromises.push(setSupabaseItem('certificates', certificates));
                    if (loadedKeys.has('qrCodes')) savePromises.push(setSupabaseItem('qrCodes', qrCodes));
                    if (loadedKeys.has('companyInfo')) savePromises.push(setSupabaseItem('companyInfo', companyInfo));
                    if (loadedKeys.has('heroConfig')) savePromises.push(setSupabaseItem('heroConfig', heroConfig));
                    if (loadedKeys.has('messages')) savePromises.push(setSupabaseItem('messages', messages));
                    if (loadedKeys.has('queries')) savePromises.push(setSupabaseItem('queries', queries));
                    if (loadedKeys.has('services')) savePromises.push(setSupabaseItem('services', services));
                    if (loadedKeys.has('companyPhilosophy_v2')) savePromises.push(setSupabaseItem('companyPhilosophy_v2', companyPhilosophy));
                    if (loadedKeys.has('partnerMerchants_v2')) savePromises.push(setSupabaseItem('partnerMerchants_v2', partnerMerchants));
                    if (loadedKeys.has('specializedServices_v2')) savePromises.push(setSupabaseItem('specializedServices_v2', specializedServices));
                    if (loadedKeys.has('licenses_v2')) savePromises.push(setSupabaseItem('licenses_v2', licenses));
                    if (loadedKeys.has('advantages')) savePromises.push(setSupabaseItem('advantages', advantages));
                    if (loadedKeys.has('teamMembers')) savePromises.push(setSupabaseItem('teamMembers', teamMembers));
                    // ✅ logo এখানে নেই — ইচ্ছাকৃতভাবে বাদ দেওয়া হয়েছে
                    
                    await Promise.all(savePromises);
                } catch (error) {
                    console.error("Error saving data to Supabase:", error);
                }
            };
            saveData();
        }, 3000);

        return () => clearTimeout(timeoutId);
   }, [
    isFullyLoaded,
    products,
    brands,
    originOptions,
    certificates,
    qrCodes,
    companyInfo,
    heroConfig,
    messages,
    queries,
    services,
    companyPhilosophy,
    partnerMerchants,
    specializedServices,
    licenses,
    advantages,
    teamMembers
]);

    const [showWeChatQR, setShowWeChatQR] = useState(false);

    // Modals & UI State
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    
    const [showAdminLogin, setShowAdminLogin] = useState(false);
    
    useEffect(() => {
        (window as any).showAdminLogin = () => setShowAdminLogin(true);
    }, []);

    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');


    // --- COMPUTED ---
    const filteredProducts = useMemo(() => {
        const filtered = (products || []).filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
            const matchesBrand = !selectedBrand || p.brand === selectedBrand;
            return matchesSearch && matchesCategory && matchesBrand;
        });
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }, [products, searchQuery, activeCategory, selectedBrand]);

    const categories = useMemo(() => {
        const uniqueCategories = [...new Set(products.map(p => p.category))].sort();
        return ['All', ...uniqueCategories];
    }, [products]);

    const brandsList = useMemo(() => {
        const uniqueBrands = [...new Set(products.map(p => p.brand))].sort();
        return ['All', ...uniqueBrands];
    }, [products]);

    const sortedBrands = useMemo(() => {
        return [...brands].sort((a, b) => a.name.localeCompare(b.name));
    }, [brands]);

    const sortedProducts = useMemo(() => {
        return [...products].sort((a, b) => a.name.localeCompare(b.name));
    }, [products]);

    // --- HANDLERS ---
    const handleSocialClick = (type: string, url: string) => {
        if (type === 'wechat') {
            setShowWeChatQR(true);
            return;
        }
        if (url) window.open(url, '_blank');
        else console.log(`${type} link not available`);
    };

    const logout = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('admin_auth');
        setIsAdmin(false);
        setActiveSection('home');
    };

    const customerLogout = async () => {
    await supabase.auth.signOut();
    setCustomerSession(null);
    setCustomerProfile(null);
    setShowCustomerAuthModal(false);
    setShowCustomerDashboard(false);
};

const generateInquiryNumber = async () => {
    const today = new Date();
    const yyyymmdd = today.toISOString().slice(0, 10).replace(/-/g, '');

    const { count, error } = await supabase
        .from('queries')
        .select('id', { count: 'exact', head: true })
        .like('inquiry_no', `SF-INQ-${yyyymmdd}-%`);

    if (error) {
        console.error('Inquiry sequence error:', error);
    }

    const sequence = (count || 0) + 1;
    const paddedSequence = String(sequence).padStart(3, '0');

    return {
        inquiryNo: `SF-INQ-${yyyymmdd}-${paddedSequence}`,
        inquirySequence: sequence
    };
};

const reloadCustomerProfile = async () => {
    if (!customerSession?.user?.id) return;

    const { data, error } = await supabase
        .from('customer_profiles')
        .select('*')
        .eq('id', customerSession.user.id)
        .limit(1)
        .maybeSingle();

    if (!error) {
        setCustomerProfile(data);
    }
};

    const openProductModal = (product: Product) => {
    const slug = `${product.brand || ''} ${product.name || ''} ${product.model || ''}`
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    navigate(`/products/${slug || product.id}`);
};

    const deleteProduct = async (id: string) => {
    const productToDelete = products.find(p => p.id === id);

    try {
        if (productToDelete) {
            const storagePaths = collectProductStoragePaths(productToDelete);
            await deleteStorageFiles(storagePaths);
        }

        await deleteSupabaseItem('products', id);

        setProducts(prev => prev.filter(p => p.id !== id));

    } catch (error) {
        console.error('Error deleting product:', error);
    }
};

    const saveBrand = async (brand: any) => {
        if (brand.id) {
            setBrands(prev => prev.map(b => b.id === brand.id ? brand : b));
        } else {
            const id = generateId();
            setBrands(prev => [...prev, { ...brand, id }]);
        }
    };

    const handleContactPictureUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setContactPictures(prev => {
                    const newPics = [...prev];
                    newPics[index] = reader.result as string;
                    return newPics;
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const removeContactPicture = (index: number) => {
        setContactPictures(prev => {
            const newPics = [...prev];
            newPics[index] = '';
            return newPics;
        });
    };

    const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        const newMessage = {
            id: generateId(),
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            whatsapp: formData.get('whatsapp') as string,
            message: formData.get('message') as string,
            pictures: contactPictures.filter(Boolean),
            date: new Date().toISOString()
        };
        setMessages(prev => [...prev, newMessage]);
        
        setContactSuccessMessage('Your message has been sent successfully! Our team will contact you soon.');
        
        if (contactFormRef.current) {
            contactFormRef.current.reset();
        }
        setContactPictures([]);
    };

    const deleteMessage = async (id: string) => {
        setMessages(prev => prev.filter(m => m.id !== id));
        try {
            await deleteSupabaseItem('messages', id);
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    };

    const deleteReferencePicture = async (id: string) => {
        setReferencePictures(prev => prev.filter(p => p.id !== id));
        try {
            await deleteSupabaseItem('referencePictures', id);
        } catch (error) {
            console.error("Error deleting reference picture:", error);
        }
    };

    const deleteCustomer = async (id: string) => {
        setCustomers(prev => prev.filter(c => c.id !== id));
        try {
            await deleteSupabaseItem('customers', id);
        } catch (error) {
            console.error("Error deleting customer:", error);
        }
    };

    const updateBrand = async (updatedBrand: any) => {
        setBrands(prev => prev.map(b => b.id === updatedBrand.id ? updatedBrand : b));
    };

    const deleteBrand = async (id: string) => {
        setBrands(prev => prev.filter(b => b.id !== id));
        try {
            await deleteSupabaseItem('brands', id);
        } catch (error) {
            console.error("Error deleting brand:", error);
        }
    };

    const addOrigin = async (origin: string) => {
        const trimmedOrigin = origin.trim();
        if (!trimmedOrigin) return;
        
        const exists = originOptions.some(o => o.toLowerCase() === trimmedOrigin.toLowerCase());
        
        if (!exists) {
            const newOptions = [...originOptions, trimmedOrigin];
            setOriginOptions(newOptions);
            
            if (adminTab === 'origins') {
                setProductForm(prev => ({ ...prev, origin: trimmedOrigin }));
            }
            
            toast.success(`Origin "${trimmedOrigin}" added successfully!`);
            
            try {
                await setSupabaseItem('originOptions', newOptions);
            } catch (error) {
                console.error("Error saving origin options:", error);
            }
        } else {
            console.log(`Origin "${trimmedOrigin}" already exists.`);
        }
    };

    const deleteOrigin = async (origin: string) => {
        const newOptions = originOptions.filter(o => o !== origin);
        setOriginOptions(newOptions);
        try {
            await deleteSupabaseItem('originOptions', origin);
        } catch (error) {
            console.error("Error deleting origin options:", error);
        }
    };

    const updateCertificates = async (certs: any) => {
        setCertificates(certs);
    };

    const updateQrCodes = async (qrs: any) => {
        setQrCodes(qrs);
    };

    const [editingId, setEditingId] = useState<string | null>(null);
    const [productForm, setProductForm] = useState<any>({
        name: '', brand: '', model: '', category: 'PLC', price: '', stockStatus: 'in-stock', image: 'https://picsum.photos/400/400', description: '', minQty: 1,
        extraSection1Label: '', extraSection1Values: [], extraSection2Label: '', extraSection2Values: [],
        extraSection3Label: '', extraSection3Values: [], extraSection4Label: '', extraSection4Values: []
    });

    const initEditProduct = (p: Product) => {
        setEditingId(p.id);
        setProductForm({ ...p });
        setAdminView('edit');
    };

    const resetProductForm = () => {
        setEditingId(null);
        setProductForm({
            name: '',
            brand: '',
            model: '',
            models: [],
            category: 'PLC',
            price: '',
            minQty: 1,
            datasheet: '',
            stockStatus: 'In Stock',
            origin: '',
            condition: 'Brand New',
            warranty: '',
            leadTime: '',
            image: 'https://picsum.photos/400/400',
            images: [],
            description: '',
            extraSection1Label: '',
            extraSection1Values: [],
            extraSection2Label: '',
            extraSection2Values: [],
            extraSection3Label: '',
            extraSection3Values: [],
            extraSection4Label: '',
            extraSection4Values: [],
            shop_link: [],  // খালি অ্যারে আকারে শপ লিঙ্ক যুক্ত করা হয়েছে
            modelImages: {},
        });
    };

    const STORAGE_BASE_URL = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/uploads/`;

const getUploadsPathFromUrl = (url?: string | null): string | null => {
    if (!url || typeof url !== 'string') return null;
    if (!url.startsWith(STORAGE_BASE_URL)) return null;

    const path = url.replace(STORAGE_BASE_URL, '');
    return path || null;
};

const collectProductStoragePaths = (product: any): string[] => {
    if (!product) return [];

    const paths = new Set<string>();

    const addIfStorageFile = (value?: string | null) => {
        const path = getUploadsPathFromUrl(value);
        if (path) paths.add(path);
    };

    addIfStorageFile(product.image);
    addIfStorageFile(product.datasheet);

    if (Array.isArray(product.images)) {
        product.images.forEach((img: string) => addIfStorageFile(img));
    }

    if (product.modelImages && typeof product.modelImages === 'object') {
        Object.values(product.modelImages).forEach((img: any) => {
            if (typeof img === 'string') addIfStorageFile(img);
        });
    }

    return Array.from(paths);
};

const deleteStorageFiles = async (paths: string[]) => {
    if (!paths.length) return;

    const { error } = await supabase.storage.from('uploads').remove(paths);

    if (error) {
        console.error('Error deleting storage files:', error);
    }
};
const hasValue = (value: any): boolean => {
    if (typeof value === 'string') return value.trim() !== '';
    if (Array.isArray(value)) return value.length > 0;
    if (value && typeof value === 'object') return Object.keys(value).length > 0;
    return value !== null && value !== undefined;
};

const mergeProductMediaSafely = (localProduct: any, remoteProduct?: any) => {
    if (!remoteProduct) return localProduct;

    return {
        ...localProduct,

        image: hasValue(localProduct.image)
            ? localProduct.image
            : remoteProduct.image,

        images: hasValue(localProduct.images)
            ? localProduct.images
            : (remoteProduct.images || []),

        modelImages: hasValue(localProduct.modelImages)
            ? localProduct.modelImages
            : (remoteProduct.modelImages || {}),

        datasheet: hasValue(localProduct.datasheet)
            ? localProduct.datasheet
            : remoteProduct.datasheet,
    };
};

const mergeProductsWithRemoteMedia = async (localProducts: any[]) => {
    try {
        const remoteProducts = await getSupabaseItem('products');

        if (!Array.isArray(remoteProducts)) {
            return localProducts;
        }

        return localProducts.map((localProduct) => {
            const remoteProduct = remoteProducts.find(
                (item: any) => item.id === localProduct.id
            );

            return mergeProductMediaSafely(localProduct, remoteProduct);
        });
    } catch (error) {
        console.error('[Safe Save] Failed to load remote products before save:', error);
        return localProducts;
    }
};

    const saveProduct = async (data: any) => {
    const existingProduct = products.find(p => p.id === (data.id || editingId));
    const productId = data.id || editingId || generateId();

    const rawProduct = {
        id: productId,
        name: data.name,
        brand: data.brand,
        model: data.model,
        models: data.models || [],
        category: data.category,
        origin: data.origin,
        image: data.image,
        images: data.images || [],
        stockStatus: data.stockStatus,
        price: data.price,
        description: data.description,
        datasheet: data.datasheet,
        leadTime: data.leadTime,
        condition: data.condition,
        warranty: data.warranty,
        minQty: Number(data.minQty),
        isPinned: data.isPinned,
        createdAt: data.createdAt || existingProduct?.createdAt || new Date().toISOString(),
        extraSection1Label: data.extraSection1Label,
        extraSection1Values: data.extraSection1Values || [],
        extraSection2Label: data.extraSection2Label,
        extraSection2Values: data.extraSection2Values || [],
        extraSection3Label: data.extraSection3Label,
        extraSection3Values: data.extraSection3Values || [],
        extraSection4Label: data.extraSection4Label,
        extraSection4Values: data.extraSection4Values || [],
        shop_link: data.shop_link || [],
        modelImages: data.modelImages || {},
    };

    const newProduct = mergeProductMediaSafely(rawProduct, existingProduct);

    try {
        if (existingProduct) {
            const oldPaths = collectProductStoragePaths(existingProduct);
            const newPaths = collectProductStoragePaths(newProduct);

            const removedPaths = oldPaths.filter(path => !newPaths.includes(path));

            if (
                hasValue(newProduct.image) ||
                hasValue(newProduct.images) ||
                hasValue(newProduct.modelImages) ||
                hasValue(newProduct.datasheet)
            ) {
                await deleteStorageFiles(removedPaths);
            }

            setProducts(prev => prev.map(p => p.id === productId ? newProduct : p));
        } else {
            setProducts(prev => [...prev, newProduct]);
        }

        setAdminView('list');
        resetProductForm();
    } catch (error) {
        console.error('Error saving product:', error);
    }
};

    const updateLogo = async (l: string) => {
        setLogo(l);
    };

    const updateHeroConfig = async (h: any) => {
        setHeroConfig(h);
    };

    const saveHeroConfig = async () => {
        try {
            await setSupabaseItem('heroConfig', heroConfig);
            toast.success('Hero configuration saved successfully!');
            console.log('Hero configuration saved successfully!');
        } catch (error) {
            toast.error('Failed to save hero configuration');
            console.error("Error saving hero config:", error);
        }
    };

    const updateCompanyInfo = async (c: any) => {
        setCompanyInfo(c);
    };

    const updateCompanyProfile = async (p: string) => {
        setCompanyProfile(p);
    };

    const updateOriginOptions = async (o: string[]) => {
        setOriginOptions(o);
    };

    const updateCertificatesState = async (certs: any) => {
        setCertificates(certs);
    };

    const updateQrCodesState = async (qrs: any) => {
        setQrCodes(qrs);
    };

    const saveAllSettings = async () => {
        try {
            await setSupabaseItem('logo', logo);
            await setSupabaseItem('companyProfile', companyProfile);
            await setSupabaseItem('heroConfig', heroConfig);
            await setSupabaseItem('companyInfo', companyInfo);
            
            await Promise.all([
                setSupabaseItem('products', await mergeProductsWithRemoteMedia(products)),
                setSupabaseItem('brands', brands),
                setSupabaseItem('certificates', certificates),
                setSupabaseItem('qrCodes', qrCodes),
                setSupabaseItem('services', services),
                setSupabaseItem('teamMembers', teamMembers),
                setSupabaseItem('companyPhilosophy_v2', companyPhilosophy),
                setSupabaseItem('partnerMerchants_v2', partnerMerchants),
                setSupabaseItem('specializedServices_v2', specializedServices),
                setSupabaseItem('licenses_v2', licenses),
                setSupabaseItem('advantages', advantages),
                setSupabaseItem('originOptions', originOptions),
                setSupabaseItem('queries', queries),
                setSupabaseItem('customers', customers),
                setSupabaseItem('referencePictures', referencePictures)
            ]);
            toast.success('All data saved successfully to Supabase!');
        } catch (error) {
            console.error("Error saving data:", error);
            toast.error('Error saving data. Please check your connection and login status.');
        }
    };

    const [queryPictures, setQueryPictures] = React.useState<string[]>(['', '', '']);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState<string>('COD');
    const [pendingPaymentMethod, setPendingPaymentMethod] = React.useState<string | null>(null);
    const [queryCity, setQueryCity] = React.useState('');
    const [queryPaymentAgreed, setQueryPaymentAgreed] = React.useState(false);
    const [selectedWarranty, setSelectedWarranty] = React.useState('');
    const [selectedLeadTime, setSelectedLeadTime] = React.useState('');
    const [selectedMobileBankingMethod, setSelectedMobileBankingMethod] = React.useState<string | null>(null);
    
    // Auto-fill state for query form
    const [queryProductName, setQueryProductName] = React.useState('');
    const [queryModelNumber, setQueryModelNumber] = React.useState('');
    const [queryQuantity, setQueryQuantity] = React.useState('');
    const [queryOrigin, setQueryOrigin] = React.useState('');
    const [queryCondition, setQueryCondition] = React.useState('');
    const [selectedProductModels, setSelectedProductModels] = React.useState<string[]>([]);
    const [extraSection1Label, setExtraSection1Label] = React.useState('');
    const [extraSection1Values, setExtraSection1Values] = React.useState<string[]>([]);
    const [queryExtra1Value, setQueryExtra1Value] = React.useState('');
    const [extraSection2Label, setExtraSection2Label] = React.useState('');
    const [extraSection2Values, setExtraSection2Values] = React.useState<string[]>([]);
    const [queryExtra2Value, setQueryExtra2Value] = React.useState('');
    const [extraSection3Label, setExtraSection3Label] = React.useState('');
    const [extraSection3Values, setExtraSection3Values] = React.useState<string[]>([]);
    const [queryExtra3Value, setQueryExtra3Value] = React.useState('');
    const [extraSection4Label, setExtraSection4Label] = React.useState('');
    const [extraSection4Values, setExtraSection4Values] = React.useState<string[]>([]);
    const [queryExtra4Value, setQueryExtra4Value] = React.useState('');

    const requireCustomerLogin = (action: () => void) => {
    if (customerSession) {
        action();
        return;
    }

    setPendingCustomerAction(() => action);
    setShowCustomerAuthModal(true);
};

    const handleOpenQueryModal = (product?: Product, selectedModel?: string, extra1?: string, extra2?: string, extra3?: string, extra4?: string) => {
    requireCustomerLogin(() => {
        if (product && typeof product === 'object' && 'name' in product) {
            setQueryProductName(product.name);
            setQueryModelNumber(selectedModel || product.model || '');
            setSelectedProductModels(product.models || []);

            setExtraSection1Label(product.extraSection1Label || '');
            setExtraSection1Values(product.extraSection1Values || []);
            setQueryExtra1Value(extra1 || '');

            setExtraSection2Label(product.extraSection2Label || '');
            setExtraSection2Values(product.extraSection2Values || []);
            setQueryExtra2Value(extra2 || '');

            setExtraSection3Label(product.extraSection3Label || '');
            setExtraSection3Values(product.extraSection3Values || []);
            setQueryExtra3Value(extra3 || '');

            setExtraSection4Label(product.extraSection4Label || '');
            setExtraSection4Values(product.extraSection4Values || []);
            setQueryExtra4Value(extra4 || '');

            setQueryQuantity(product.minQty?.toString() || '1');
            setQueryOrigin(product.origin || '');
            setQueryCondition(product.condition || '');
            setSelectedLeadTime(product.leadTime || '');
        } else {
            setQueryProductName('');
            setQueryModelNumber('');
            setSelectedProductModels([]);
            setExtraSection1Label('');
            setExtraSection1Values([]);
            setQueryExtra1Value('');
            setExtraSection2Label('');
            setExtraSection2Values([]);
            setQueryExtra2Value('');
            setQueryExtra3Value('');
            setQueryExtra4Value('');
            setQueryQuantity('');
            setQueryOrigin('');
            setQueryCondition('');
            setSelectedLeadTime('');
        }

        setQueryPictures(['', '', '']);
        setShowQueryModal(true);
    });
};

    const handleQuerySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("handleQuerySubmit called");
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const validPictures = queryPictures.filter(p => p !== '');

    if (['Mobile banking', 'Bank', 'Card'].includes(selectedPaymentMethod) && !queryPaymentAgreed) {
    alert('Please confirm the payment terms checkbox before submitting.');
    return;
}

if (
    selectedPaymentMethod === 'Mobile banking' &&
    !selectedMobileBankingMethod
) {
    alert('Please select Bkash, Nagad or Rocket.');
    return;
}

    const inquiryInfo = await generateInquiryNumber();

    const newQuery: Query = {
        id: generateId(),
        customerId: customerSession?.user?.id || '',
        customer_profile_image_url: customerProfile?.profile_image_url || '',

        inquiryNo: inquiryInfo.inquiryNo,
        inquiry_no: inquiryInfo.inquiryNo,
        inquiry_status: 'pending',

        quotationNo: '',
        quotation_no: '',
        quotation_sent: false,
        quotation_status: 'not_sent',

        customer_action: 'pending',
        payment_status: 'unpaid',

        date: new Date().toISOString(),
        customerName: formData.get('name') as string,
        customerPhone: formData.get('phone') as string,
        customerEmail: formData.get('email') as string,
        companyName: formData.get('companyName') as string,
        postName: formData.get('postName') as string,
        city: formData.get('city') as string,
        thana: formData.get('thana') as string,
        productName: formData.get('productName') as string,
        modelNumber: formData.get('modelNumber') as string,
        quantity: Number(formData.get('quantity')),
        origin: formData.get('origin') as string,
        condition: formData.get('condition') as string,
        warranty: formData.get('warranty') as string,
        leadTime: formData.get('leadTime') as string,
        paymentMethod: selectedPaymentMethod as any,
        mobileBankingMethod: selectedMobileBankingMethod || undefined,
        prNumber: formData.get('prNumber') as string,
        requirement: formData.get('requirement') as string,
        pictures: validPictures,
        status: 'Pending',
        customerDecision: 'pending',

        extra1Label: extraSection1Label,
        extra1Value: queryExtra1Value,
        extra2Label: extraSection2Label,
        extra2Value: queryExtra2Value,
        extra3Label: extraSection3Label,
        extra3Value: queryExtra3Value,
        extra4Label: extraSection4Label,
        extra4Value: queryExtra4Value
    };

    console.log("New Query Object:", newQuery);

    setQueries(prev => {
        const updated = [newQuery, ...prev];

        const saveQuery = async () => {
            try {
                const insertData = camelToSnake(newQuery);
                insertData.id = ensureValidUuid(insertData.id);

                const { error } = await supabase
                    .from('queries')
                    .insert(insertData);

                if (error) throw error;

                console.log("Query inserted directly to Supabase successfully");
            } catch (insertErr) {
                console.error("Direct insert failed:", insertErr);
            }
        };

        saveQuery();
        return updated;
    });

    setShowQueryModal(false);
    setQueryPictures(['', '', '']);
    setSelectedPaymentMethod('COD');
    setPendingPaymentMethod(null);
    setQueryCity('');
    setQueryPaymentAgreed(false);

    const adminMsg = `New Query Received!

Inquiry No: ${newQuery.inquiryNo}
Customer: ${newQuery.customerName}
Phone: ${newQuery.customerPhone}
Product: ${newQuery.productName}
Model: ${newQuery.modelNumber}
Qty: ${newQuery.quantity}
Origin: ${newQuery.origin}
Lead Time: ${newQuery.leadTime}
Warranty: ${newQuery.warranty}
Payment: ${newQuery.paymentMethod}`;

    const whatsappUrl = `https://wa.me/${formatWhatsAppNumber(companyInfo.whatsapp)}?text=${encodeURIComponent(adminMsg)}`;
    window.open(whatsappUrl, '_blank');

    setContactSuccessMessage('Your inquiry has been submitted successfully! We will contact you soon.');

    console.log('Your inquiry has been submitted successfully! We will contact you soon.');
};

    const handleQueryPictureUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        const reader = new FileReader();
        const promise = new Promise<string>((resolve) => {
            reader.onloadend = async () => {
                const base64 = reader.result as string;
                const resized = await resizeImage(base64);
                resolve(resized);
            };
        });
        reader.readAsDataURL(file);
        const resized = await promise;
        setQueryPictures(prev => {
            const newPics = [...prev];
            newPics[index] = resized;
            return newPics;
        });
    };

    // --- RENDER ---
    if (!isLoaded) {
        return (
            <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center p-6 text-center">
                {/* 👇 SEO Hidden Content – Google কে আসল কন্টেন্ট দেখানোর জন্য */}
                <div style={{ display: 'none' }} aria-hidden="true">
                    <h1>Shafa Abid Automation BD – Industrial Automation & Electrical Solution in Bangladesh</h1>
                    <p>We supply PLC, VFD, HMI, Soft Starter, Servo Drive, CNC Controller, Industrial Panel, Temperature Controller, Proximity Sensor, Photo Sensor, Encoder, Pressure Switch, Limit Switch, Relay, Timer, Counter, Power Supply, Circuit Breaker, MCB, MCCB, Contactor, Overload Relay, Terminal Block, Junction Box, Cable Tray, Control Panel, Electrical Panel, Automation Panel, SCADA System, DCS System, Industrial PC, HMI Panel, VFD Panel, Soft Starter Panel, PLC Panel from brands like Siemens, ABB, Schneider Electric, Mitsubishi, Delta, Omron, Keyence, Fuji, Yokogawa, Honeywell, Danfoss, Rockwell Automation.</p>
                    <p>Best price industrial automation products in Chittagong, Dhaka, Khulna, Rajshahi, Sylhet, Barishal, Rangpur, Mymensingh and all over Bangladesh.</p>
                    <p>Contact us for ABB Drive, Siemens PLC, VFD Price BD, Industrial Automation Solutions, Electrical Procurement, Modernization of Industrial Processes, Specialized Technical Services.</p>
                </div>

                {/* 👇 আপনার বিদ্যমান UI (যেটা আপনি edit করেছেন) */}
                <div className="w-full max-w-md space-y-8">
                    {/* Progress Circle */}
                    <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100" />
                            <motion.circle
                                cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="6" fill="transparent"
                                strokeDasharray="282.7"
                                initial={{ strokeDashoffset: 282.7 }}
                                animate={{ strokeDashoffset: 282.7 - (282.7 * loadProgress) / 100 }}
                                className="text-brand-blue"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="relative z-10 flex flex-col items-center justify-center">
                            <span className="text-brand-blue font-black text-2xl leading-none">{loadProgress}%</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h2 className="text-brand-dark font-black uppercase tracking-widest text-lg">
                                {heroConfig?.loaderBrandText || 'Shafa Abid Automation BD'}
                            </h2>
                            <p className="text-slate-500 font-medium text-sm">
                                {heroConfig?.loaderLine1English || 'Initializing Industrial Solutions...'}
                            </p>
                        </div>

                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <motion.div className="bg-brand-blue h-full" initial={{ width: 0 }} animate={{ width: `${loadProgress}%` }} transition={{ duration: 0.3 }} />
                        </div>

                        {/* 👇 এখানে আপনার করা UI পরিবর্তন রাখা হয়েছে */}
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <div className="flex items-center gap-1">
                                <span>System Boot</span>
                                <span className="text-brand-blue">{loadProgress}%</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span>Status:</span>
                                <span>{loadProgress === 100 ? 'Ready' : 'Loading...'}</span>
                            </div>
                        </div>

                        <div className="pt-4 space-y-2 border-t border-slate-50">
                            <p className="text-brand-orange font-medium text-sm font-bangla">
                                {heroConfig?.loaderLineBangla || 'নতুন ও ভিন্ন কিছু আসছে। অনুগ্রহ করে অপেক্ষা করুন।'}
                            </p>
                            <p className="text-slate-400 text-xs italic">
                                {heroConfig?.loaderLine2English || 'Something new and different is on the way.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <Helmet>
                <title>{activeSection === 'home' ? 'Shafa Abid Automation BD | Industrial Automation Solutions' : `${activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} | Shafa Abid Automation BD`}</title>
                <meta name="description" content="Shafa Abid Automation BD - Your trusted partner in industrial automation and electrical solutions in Bangladesh. We provide PLCs, HMIs, VFDs, and specialized engineering services." />
                <meta name="keywords" content="Industrial Automation Bangladesh, PLC, HMI, VFD, Electrical Solutions, Shafa Abid Automation, Engineering Services Bangladesh" />
                <meta property="og:title" content="Shafa Abid Automation BD" />
                <meta property="og:description" content="Industrial Automation & Electrical Solution - Your trusted partner in industrial automation solutions in Bangladesh." />
                <meta
                    property="og:image"
                    content={logo?.startsWith('http') 
                        ? logo 
                        : `https://shafaabidautomation.com.bd${logo}`
                    }
                />
                <meta property="og:type" content="website" />
                <link rel="canonical" href={`https://shafaabidautomation.com.bd${location.pathname}`} />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "name": "Shafa Abid Automation BD",
                        "url": "https://shafaabidautomation.com.bd/",
                        "logo": logo?.startsWith('http') 
                            ? logo 
                            : `https://shafaabidautomation.com.bd${logo}`,
                        "description": "Your trusted partner in industrial automation and electrical solutions in Bangladesh.",
                        "address": {
                            "@type": "PostalAddress",
                            "addressCountry": "BD"
                        },
                        "contactPoint": {
                            "@type": "ContactPoint",
                            "telephone": "+8801711111111",
                            "contactType": "customer service"
                        }
                    })}
                </script>
            </Helmet>
<CustomerAuthModal
    isOpen={showCustomerAuthModal}
    onClose={() => setShowCustomerAuthModal(false)}
    onAuthSuccess={() => {
        if (pendingCustomerAction) {
            pendingCustomerAction();
            setPendingCustomerAction(null);
        }
    }}
/>



<CustomerDashboardModal
    isOpen={showCustomerDashboard}
    onClose={() => setShowCustomerDashboard(false)}
    customerProfile={customerProfile}
    customerLogout={customerLogout}
    onEditProfile={() => setShowEditProfileModal(true)}
    customerQueries={customerQueries}
/>

<EditProfileModal
    isOpen={showEditProfileModal}
    onClose={() => setShowEditProfileModal(false)}
    customerProfile={customerProfile}
    onProfileUpdated={reloadCustomerProfile}
/>

<Toaster position="top-right" richColors />
            <Header 
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                setSelectedBrand={setSelectedBrand}
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                isAdmin={isAdmin}
                setShowAdminLogin={setShowAdminLogin}
                logout={logout}
                logo={logo}
                isAdminMode={isAdminMode}
                customerSession={customerSession}
customerProfile={customerProfile}
setShowCustomerAuthModal={setShowCustomerAuthModal}
customerLogout={customerLogout}
setShowCustomerDashboard={setShowCustomerDashboard}
            />

            <div 
                className="sticky z-[45] bg-white shadow-md transition-all duration-300 block max-w-[1920px] mx-auto w-full overflow-visible" 
                style={{ 
                    top: (typeof window !== 'undefined' && window.innerWidth < 1024) 
                        ? (isScrolled ? '0px' : '40px') 
                        : '48px'
                }}
            >
                <div className="bg-white relative z-10">
                    <LogoScroller 
                        key={`${JSON.stringify(brands)}-${companyInfo.logoScrollSpeed || 20}`}
                        brands={brands} 
                        onBrandClick={(brand) => {
                            setSelectedBrand(brand.name);
                            setActiveSection('products');
                        }} 
                        duration={companyInfo.logoScrollSpeed || 20}
                    />
                </div>
            </div>

            <AnimatePresence>
                {contactSuccessMessage && (
                    <motion.div 
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md"
                    >
                        <div className="bg-green-500 text-white p-4 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-4 border border-green-400">
                            <div className="flex items-center gap-3 w-full">
                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                                    <i className="fas fa-check"></i>
                                </div>
                                <p className="text-xs font-black uppercase tracking-widest leading-tight flex-grow">{contactSuccessMessage}</p>
                            </div>
                            <button 
                                onClick={() => setContactSuccessMessage(null)}
                                className="bg-white text-green-600 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-50 transition-colors shrink-0 w-full sm:w-auto"
                            >
                                I know
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="flex-grow pb-16 lg:pb-0 max-w-[1920px] mx-auto w-full relative z-0">
                {(() => {
                    const contactFormContent = (
                        <div className="bg-white p-6 sm:p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
                            <h3 className="text-2xl font-black text-brand-dark uppercase mb-6">Send a Message</h3>
                            <form ref={contactFormRef} className="space-y-4" onSubmit={handleContactSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input name="name" type="text" required placeholder="Your Name" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:border-brand-blue transition-all" />
                                    <input name="email" type="email" required placeholder="Email Address" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:border-brand-blue transition-all" />
                                </div>
                                <input name="whatsapp" type="text" placeholder="WhatsApp Number" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:border-brand-blue transition-all" />
                                <textarea name="message" required placeholder="How can we help you?" rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:border-brand-blue transition-all resize-none"></textarea>
                                
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Existing Product Pictures (Optional - Max 3)</label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {[0, 1, 2].map(i => (
                                            <div key={i} className="relative aspect-square rounded-2xl border-2 border-dashed border-slate-200 overflow-hidden group">
                                                {contactPictures[i] ? (
                                                    <>
                                                        <img src={contactPictures[i]} alt={`Upload ${i}`} className="w-full h-full object-cover" />
                                                        <button 
                                                            type="button"
                                                            onClick={() => removeContactPicture(i)}
                                                            className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </>
                                                ) : (
                                                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:border-brand-blue hover:bg-slate-50 transition-all">
                                                        <i className="fas fa-camera text-slate-300 group-hover:text-brand-blue transition-colors"></i>
                                                        <span className="text-[8px] font-black text-slate-400 uppercase mt-1">Upload</span>
                                                        <input 
                                                            type="file" 
                                                            accept="image/*" 
                                                            className="hidden" 
                                                            onChange={(e) => handleContactPictureUpload(e, i)}
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button type="submit" className="w-full bg-brand-blue text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg">Send Message</button>
                            </form>
                        </div>
                    );

                    const queryFormContent = (
                        <QueryForm 
                            handleQuerySubmit={handleQuerySubmit}
                            queryCity={queryCity}
                            setQueryCity={setQueryCity}
                            queryProductName={queryProductName}
                            setQueryProductName={setQueryProductName}
                            queryModelNumber={queryModelNumber}
                            setQueryModelNumber={setQueryModelNumber}
                            queryQuantity={queryQuantity}
                            setQueryQuantity={setQueryQuantity}
                            queryOrigin={queryOrigin}
                            setQueryOrigin={setQueryOrigin}
                            originOptions={originOptions}
                            queryCondition={queryCondition}
                            setQueryCondition={setQueryCondition}
                            selectedLeadTime={selectedLeadTime}
                            setSelectedLeadTime={setSelectedLeadTime}
                            selectedWarranty={selectedWarranty}
                            setSelectedWarranty={setSelectedWarranty}
                            selectedPaymentMethod={selectedPaymentMethod}
                            setSelectedPaymentMethod={setSelectedPaymentMethod}
                            pendingPaymentMethod={pendingPaymentMethod}
                            setPendingPaymentMethod={setPendingPaymentMethod}
                            selectedMobileBankingMethod={selectedMobileBankingMethod}
                            setSelectedMobileBankingMethod={setSelectedMobileBankingMethod}
                            queryPaymentAgreed={queryPaymentAgreed}
                            setQueryPaymentAgreed={setQueryPaymentAgreed}
                            queryPictures={queryPictures}
                            handleQueryPictureUpload={handleQueryPictureUpload}
                            setQueryPictures={setQueryPictures}
                            PAYMENT_NOTIFICATIONS={PAYMENT_NOTIFICATIONS}
                            selectedProductModels={selectedProductModels}
                            extraSection1Label={extraSection1Label}
                            extraSection1Values={extraSection1Values}
                            queryExtra1Value={queryExtra1Value}
                            setQueryExtra1Value={setQueryExtra1Value}
                            extraSection2Label={extraSection2Label}
                            extraSection2Values={extraSection2Values}
                            queryExtra2Value={queryExtra2Value}
                            setQueryExtra2Value={setQueryExtra2Value}

                            clientData={{
    name: customerProfile?.full_name || '',
    phone: customerProfile?.mobile || '',
    email: customerProfile?.email || '',
    companyName: customerProfile?.company_name || '',
    postName: customerProfile?.post_name || '',
    city: customerProfile?.city || customerProfile?.district || '',
    thana: customerProfile?.thana || ''
}}

                        />
                    );
                    return (
                        <>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={isAdminMode ? 'admin' : activeSection}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                >
                                    <React.Suspense fallback={<div className="h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div></div>}>
                                        <Routes location={location}>
                                            <Route path="/admin" element={
                                                isAdmin ? (
                                                    <AdminPanel 
                                                        adminTab={adminTab}
                                                        setAdminTab={setAdminTab}
                                                        adminView={adminView}
                                                        setAdminView={setAdminView}
                                                        products={sortedProducts}
                                                        brands={sortedBrands}
                                                        originOptions={originOptions}
                                                        initEditProduct={initEditProduct}
                                                        deleteProduct={deleteProduct}
                                                        resetProductForm={resetProductForm}
                                                        productForm={productForm}
                                                        setProductForm={setProductForm}
                                                        saveProduct={saveProduct}
                                                        editingId={editingId}
                                                        setIsAdmin={setIsAdmin}
                                                        saveBrand={saveBrand}
                                                        deleteBrand={deleteBrand}
                                                        addOrigin={addOrigin}
                                                        deleteOrigin={deleteOrigin}
                                                        logout={logout}
                                                        heroConfig={heroConfig}
                                                        setHeroConfig={updateHeroConfig}
                                                        saveHeroConfig={saveHeroConfig}
                                                        saveAllSettings={saveAllSettings}
                                                        certificates={certificates}
                                                        updateCertificates={updateCertificatesState}
                                                        qrCodes={qrCodes}
                                                        updateQrCodes={updateQrCodesState}
                                                        logo={logo}
                                                        setLogo={setLogo}
                                                        companyInfo={companyInfo}
                                                        setCompanyInfo={updateCompanyInfo}
                                                        messages={messages}
                                                        deleteMessage={deleteMessage}
                                                        updateBrand={updateBrand}
                                                        companyProfile={companyProfile}
                                                        setCompanyProfile={updateCompanyProfile}
                                                        queries={queries}
                                                        setQueries={setQueries}
                                                        services={services}
                                                        setServices={setServices}
                                                        companyPhilosophy={companyPhilosophy}
                                                        setCompanyPhilosophy={setCompanyPhilosophy}
                                                        partnerMerchants={partnerMerchants}
                                                        setPartnerMerchants={setPartnerMerchants}
                                                        specializedServices={specializedServices}
                                                        setSpecializedServices={setSpecializedServices}
                                                        licenses={licenses}
                                                        setLicenses={setLicenses}
                                                        advantages={advantages}
                                                        setAdvantages={setAdvantages}
                                                        teamMembers={teamMembers}
                                                        setTeamMembers={setTeamMembers}
                                                        customers={customers}
                                                        setCustomers={setCustomers}
                                                        referencePictures={referencePictures}
                                                        setReferencePictures={setReferencePictures}
                                                        setSupabaseItem={setSupabaseItem}
                                                        deleteReferencePicture={deleteReferencePicture}
                                                    />
                                                ) : (
                                                    <Navigate to="/" replace />
                                                )
                                            } />
                                            <Route path="/reference" element={<Reference pictures={referencePictures} />} />
                                            <Route path="/about" element={
                                                <About 
                                                    companyInfo={companyInfo}
                                                    logo={logo}
                                                    companyPhilosophy={companyPhilosophy}
                                                    partnerMerchants={partnerMerchants}
                                                    specializedServices={specializedServices}
                                                    licenses={licenses}
                                                    advantages={advantages}
                                                    teamMembers={teamMembers}
                                                    customers={customers}
                                                    handleSocialClick={handleSocialClick}
                                                />
                                            } />
                                            <Route path="/" element={
                                                <Home 
                                                    heroConfig={heroConfig} 
                                                    setActiveSection={setActiveSection}
                                                    companyProfile={companyProfile}
                                                    products={(products || []).filter(p => p.stockStatus === 'in-stock').slice(0, 10)}
                                                    pinnedProducts={(products || []).filter(p => p.isPinned)}
                                                    openProductModal={openProductModal}
                                                    services={services}
                                                    brands={sortedBrands}
                                                    selectedBrand={selectedBrand}
                                                    setSelectedBrand={setSelectedBrand}
                                                    filteredProducts={filteredProducts}
                                                    categories={categories}
                                                    activeCategory={activeCategory}
                                                    setActiveCategory={setActiveCategory}
                                                    openQueryModal={handleOpenQueryModal}
                                                    specializedServices={specializedServices}
                                                />
                                            } />
                                            <Route path="/products" element={
                                                <Products 
                                                    brands={sortedBrands}
                                                    selectedBrand={selectedBrand}
                                                    setSelectedBrand={setSelectedBrand}
                                                    contactFormRef={contactFormRef}
                                                    handleContactSubmit={handleContactSubmit}
                                                    contactPictures={contactPictures}
                                                    handleContactPictureUpload={handleContactPictureUpload}
                                                    removeContactPicture={removeContactPicture}
                                                    searchQuery={searchQuery}
                                                    setSearchQuery={setSearchQuery}
                                                    activeCategory={activeCategory}
                                                    setActiveCategory={setActiveCategory}
                                                    categories={categories}
                                                    filteredProducts={filteredProducts}
                                                    openProductModal={openProductModal}
                                                    openQueryModal={handleOpenQueryModal}
                                                />
                                            } />
                                            <Route path="/services" element={<Services services={services} specializedServices={specializedServices} />} />
                                            <Route path="/contact" element={
                                                <Contact 
                                                    teamMembers={teamMembers}
                                                    companyInfo={companyInfo}
                                                    qrCodes={qrCodes}
                                                    contactFormRef={contactFormRef}
                                                    handleContactSubmit={handleContactSubmit}
                                                    contactPictures={contactPictures}
                                                    handleContactPictureUpload={handleContactPictureUpload}
                                                    removeContactPicture={removeContactPicture}
                                                    technicalServices={technicalServices}
                                                />
                                            } />
                                            <Route path="/products/:productId" element={
                                                <ProductDetail 
                                                    products={products}
                                                    openQueryModal={handleOpenQueryModal}
                                                />
                                            } />
                                        </Routes>
                                    </React.Suspense>
                                </motion.div>
                            </AnimatePresence>
                        </>
                    );
                })()}
                <PaymentMethods />
            </main>
            <Footer logo={logo} companyInfo={companyInfo} handleSocialClick={handleSocialClick} qrCodes={qrCodes} />
            <BottomNav activeSection={activeSection} setActiveSection={setActiveSection} setSelectedBrand={setSelectedBrand} />

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-[1000] lg:hidden"
                        />
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-white z-[1001] lg:hidden shadow-2xl flex flex-col"
                        >
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                {logo && <img src={logo} alt="Logo" className="h-10 w-auto" />}
                                <button onClick={() => setIsMobileMenuOpen(false)} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-brand-blue transition-all">
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                            <div className="flex-grow overflow-y-auto p-6 space-y-2">
                                {['home', 'about', 'products', 'services', 'reference', 'contact'].map(item => (
                                    <button 
                                        key={item} 
                                        onClick={() => {
                                            setActiveSection(item);
                                            if (item !== 'products') setSelectedBrand(null);
                                            setIsMobileMenuOpen(false);
                                        }} 
                                        className={`w-full text-left px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all flex items-center justify-between group ${
                                            activeSection === item 
                                                ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' 
                                                : 'text-slate-500 hover:bg-slate-50 hover:text-brand-blue'
                                        }`}
                                    >
                                        {item === 'reference' ? 'Reference Pictures' : item === 'about' ? 'About Us' : item === 'contact' ? 'Contact Us' : item}
                                        <i className={`fas fa-chevron-right text-[10px] transition-transform group-hover:translate-x-1 ${activeSection === item ? 'opacity-100' : 'opacity-0'}`}></i>
                                    </button>
                                ))}
                            </div>
                            <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                                <div className="flex flex-col gap-4">
                                    <a href={`tel:${companyInfo.phone}`} className="flex items-center gap-3 text-slate-600 hover:text-brand-blue transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-brand-blue">
                                            <i className="fas fa-phone-alt"></i>
                                        </div>
                                        <span className="text-xs font-bold">{companyInfo.phone}</span>
                                    </a>
                                    <a href={`mailto:${companyInfo.email}`} className="flex items-center gap-3 text-slate-600 hover:text-brand-blue transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-brand-orange">
                                            <i className="fas fa-envelope"></i>
                                        </div>
                                        <span className="text-xs font-bold">{companyInfo.email}</span>
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {showQueryModal && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-brand-dark/95 backdrop-blur-md overflow-y-auto">
                    <div className="relative w-full max-w-2xl my-auto py-8">
                        <button onClick={() => setShowQueryModal(false)} className="fixed top-4 right-4 sm:top-6 sm:right-6 w-12 h-12 bg-white text-brand-dark rounded-full shadow-2xl flex items-center justify-center hover:bg-brand-orange hover:text-white transition-all z-[100000] border-4 border-slate-100">
                            <i className="fas fa-times text-xl"></i>
                        </button>
                        <div className="relative">
                            <QueryForm 
                                handleQuerySubmit={handleQuerySubmit}
                                queryCity={queryCity}
                                setQueryCity={setQueryCity}
                                queryProductName={queryProductName}
                                setQueryProductName={setQueryProductName}
                                queryModelNumber={queryModelNumber}
                                setQueryModelNumber={setQueryModelNumber}
                                queryQuantity={queryQuantity}
                                setQueryQuantity={setQueryQuantity}
                                queryOrigin={queryOrigin}
                                setQueryOrigin={setQueryOrigin}
                                originOptions={originOptions}
                                queryCondition={queryCondition}
                                setQueryCondition={setQueryCondition}
                                selectedLeadTime={selectedLeadTime}
                                setSelectedLeadTime={setSelectedLeadTime}
                                selectedWarranty={selectedWarranty}
                                setSelectedWarranty={setSelectedWarranty}
                                selectedPaymentMethod={selectedPaymentMethod}
                                setSelectedPaymentMethod={setSelectedPaymentMethod}
                                pendingPaymentMethod={pendingPaymentMethod}
                                setPendingPaymentMethod={setPendingPaymentMethod}
                                selectedMobileBankingMethod={selectedMobileBankingMethod}
                                setSelectedMobileBankingMethod={setSelectedMobileBankingMethod}
                                queryPaymentAgreed={queryPaymentAgreed}
                                setQueryPaymentAgreed={setQueryPaymentAgreed}
                                queryPictures={queryPictures}
                                handleQueryPictureUpload={handleQueryPictureUpload}
                                setQueryPictures={setQueryPictures}
                                PAYMENT_NOTIFICATIONS={PAYMENT_NOTIFICATIONS}
                                selectedProductModels={selectedProductModels}
                                extraSection1Label={extraSection1Label}
                                extraSection1Values={extraSection1Values}
                                queryExtra1Value={queryExtra1Value}
                                setQueryExtra1Value={setQueryExtra1Value}
                                extraSection2Label={extraSection2Label}
                                extraSection2Values={extraSection2Values}
                                queryExtra2Value={queryExtra2Value}
                                setQueryExtra2Value={setQueryExtra2Value}

                                clientData={{
    name: customerProfile?.full_name || '',
    phone: customerProfile?.mobile || '',
    email: customerProfile?.email || '',
    companyName: customerProfile?.company_name || '',
    postName: customerProfile?.post_name || '',
    city: customerProfile?.city || customerProfile?.district || '',
    thana: customerProfile?.thana || ''
}}
                            />
                        </div>
                    </div>
                </div>
            )}
            <ProductModal 
                isProductModalOpen={isProductModalOpen}
                closeProductModal={() => setIsProductModalOpen(false)}
                selectedProduct={selectedProduct}
                openQueryModal={(product, model, extra1, extra2) => {
                    handleOpenQueryModal(product, model, extra1, extra2);
                }}
            />

            <AdminLogin 
                showAdminLogin={showAdminLogin}
                setShowAdminLogin={setShowAdminLogin}
                setIsAdmin={setIsAdmin}
            />

            {showWeChatQR && (
                <div className="wechat-qr-modal" onClick={() => setShowWeChatQR(false)}>
                    <div className="wechat-qr-content animate-fade-in" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setShowWeChatQR(false)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all">
                            <i className="fas fa-times"></i>
                        </button>
                        <h3 className="text-xl font-black text-brand-dark uppercase mb-6">Scan WeChat QR</h3>
                        {qrCodes.wechat ? (
                            qrCodes.wechat.startsWith('http') ? (
                                <div className="w-64 h-64 mx-auto rounded-2xl border-4 border-slate-50 shadow-xl bg-white p-2">
                                    <QRCodeCanvas value={qrCodes.wechat} size={240} className="w-full h-full" />
                                </div>
                            ) : (
                                <img src={qrCodes.wechat} className="w-64 h-64 mx-auto rounded-2xl border-4 border-slate-50 shadow-xl" alt="WeChat QR" />
                            )
                        ) : (
                            <div className="w-64 h-64 mx-auto bg-slate-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200">
                                <i className="fab fa-weixin text-4xl text-slate-300 mb-2"></i>
                                <p className="text-[10px] font-black text-slate-400 uppercase">QR Not Uploaded</p>
                            </div>
                        )}
                        <p className="mt-6 text-sm text-slate-500 font-bold uppercase tracking-widest">WeChat ID: {companyInfo.wechat}</p>
                    </div>
                </div>
            )}

            {isAdmin && (
                <div className="fixed inset-0 pointer-events-none z-[9999]">
                    <div className="max-w-[1920px] mx-auto relative h-full">
                        <button
                            onClick={() => {
                                if (isAdminMode) {
                                    navigate('/');
                                } else {
                                    navigate('/admin');
                                }
                            }}
                            className="absolute bottom-6 right-6 pointer-events-auto bg-brand-dark text-white w-14 h-14 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group border-4 border-white"
                            title={isAdminMode ? "Switch to Main Page" : "Switch to Admin Panel"}
                        >
                            <i className={`fas ${isAdminMode ? 'fa-store' : 'fa-user-shield'} text-xl`}></i>
                            <span className="absolute right-full mr-4 bg-brand-dark text-white text-xs font-bold px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
                                {isAdminMode ? "View Main Page" : "View Admin Panel"}
                            </span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;