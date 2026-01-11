import React, { useState, useEffect } from 'react';
import { Lock, UserCheck, ShieldCheck, Smartphone } from 'lucide-react';

const Hero: React.FC = () => {
  const [spots, setSpots] = useState(315);
  const [username, setUsername] = useState('');
  
  // States: idle -> searching -> found -> activating -> verify
  const [step, setStep] = useState<'idle' | 'searching' | 'found' | 'activating' | 'verify'>('idle');
  
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing connection...');
  const [error, setError] = useState(false);
  
  // Profile Data
  const [profileData, setProfileData] = useState<{followers: string; likes: string; img: string} | null>(null);

  // Scarcity counter effect
  useEffect(() => {
    const interval = setInterval(() => {
      setSpots((prevSpots) => {
        if (prevSpots <= 12) return prevSpots;
        const decrease = Math.floor(Math.random() * 3) + 1;
        return Math.max(12, prevSpots - decrease);
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const formatStats = (num: number) => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Searching Effect with Real Data Fetching
  useEffect(() => {
    if (step === 'searching') {
      let isMounted = true;
      const cleanUsername = username.replace(/^@/, '');
      
      const fetchData = async () => {
        try {
          // 1. Initial Status
          setStatusText("Connecting to TikTok Database...");
          await new Promise(r => setTimeout(r, 800));
          if (!isMounted) return;

          setStatusText(`Querying user @${cleanUsername}...`);
          
          // 2. Race condition: Fetch vs Timeout (Fallback)
          // We use lang=en to ensure standard meta tags if we fallback to regex
          const targetUrl = `https://www.tiktok.com/@${cleanUsername}?lang=en`;
          const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
          
          const fetchPromise = fetch(proxyUrl);
          const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 8000));

          // 3. Update Status while fetching
          const statusInterval = setInterval(() => {
             setStatusText(prev => prev === "Fetching public profile data..." ? "Parsing metadata..." : "Fetching public profile data...");
          }, 1500);

          try {
            const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;
            clearInterval(statusInterval);
            
            if (!response.ok) throw new Error('Network response was not ok');
            
            const html = await response.text();
            
            let img = '';
            let followers = '';
            let likes = '';
            let found = false;

            // STRATEGY 1: Parse SIGI_STATE (JSON data embedded in script)
            // This contains the raw data passed to the hydration engine
            try {
                const sigiMatch = html.match(/<script id="SIGI_STATE" type="application\/json">(.*?)<\/script>/);
                if (sigiMatch && sigiMatch[1]) {
                    const data = JSON.parse(sigiMatch[1]);
                    const userModule = data.UserModule;
                    // Try to find user info in the users map
                    const usersMap = userModule?.users;
                    let userInfo = usersMap ? Object.values(usersMap)[0] : null;
                    
                    // Sometimes the key is the username, sometimes userid
                    if (!userInfo && usersMap && usersMap[cleanUsername]) {
                        userInfo = usersMap[cleanUsername];
                    }

                    if (userInfo) {
                        // Stats might be in a separate stats object
                        const stats = userModule?.stats?.[cleanUsername] || userModule?.stats?.[(userInfo as any).id];
                        
                        if (stats) {
                            followers = formatStats(stats.followerCount);
                            likes = formatStats(stats.heartCount);
                            img = (userInfo as any).avatarLarger || (userInfo as any).avatarMedium;
                            found = true;
                        }
                    }
                }
            } catch (e) {
                console.log("Strategy 1 failed", e);
            }

            // STRATEGY 2: Parse __UNIVERSAL_DATA_FOR_REHYDRATION__ (Newer TikTok structure)
            if (!found) {
                try {
                     const hydrationMatch = html.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application\/json">(.*?)<\/script>/);
                     if (hydrationMatch && hydrationMatch[1]) {
                        const data = JSON.parse(hydrationMatch[1]);
                        const userDetail = data["__DEFAULT_SCOPE__"]?.["webapp.user-detail"]?.userInfo;
                        if (userDetail) {
                            followers = formatStats(userDetail.stats.followerCount);
                            likes = formatStats(userDetail.stats.heartCount);
                            img = userDetail.user.avatarLarger || userDetail.user.avatarMedium;
                            found = true;
                        }
                     }
                } catch (e) {
                    console.log("Strategy 2 failed", e);
                }
            }

            // STRATEGY 3: Meta Tags (Classic scraping)
            if (!found) {
                // og:image usually holds the profile picture
                const imgMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
                // description usually holds "User (@user) | Likes. Followers. Watch the latest video..."
                const descMatch = html.match(/<meta name="description" content="([^"]+)"/);

                if (imgMatch && imgMatch[1]) {
                    img = imgMatch[1];
                }

                if (descMatch && descMatch[1]) {
                    const desc = descMatch[1];
                    // Look for patterns like "1.5B Likes" or "75.3M Followers"
                    const followerMatch = desc.match(/([\d\.]+([KMBkmb])?)\s*([Ff]ollowers|[Tt]akipçi)/);
                    const likeMatch = desc.match(/([\d\.]+([KMBkmb])?)\s*([Ll]ikes|[Bb]eğeni)/);

                    if (followerMatch) followers = followerMatch[1];
                    if (likeMatch) likes = likeMatch[1];
                    
                    if (img && followers) found = true;
                }
            }

            if (!found || !followers) throw new Error("Could not parse data");

            if (isMounted) {
                setProfileData({ followers, likes: likes || '0', img });
                setStatusText("Profile Found!");
                await new Promise(r => setTimeout(r, 500));
                setStep('found');
            }

          } catch (err) {
            // FALLBACK: If real fetch fails, use simulation
            clearInterval(statusInterval);
            console.log("Fallback to simulation due to:", err);
            
            if (isMounted) {
                setStatusText("Analyzing backup servers...");
                await new Promise(r => setTimeout(r, 1000));
                
                // Generate fake stats
                const simFollowers = (Math.floor(Math.random() * 900) + 10) + '.' + (Math.floor(Math.random() * 9)) + 'k';
                const simLikes = (Math.floor(Math.random() * 500) + 5) + '.' + (Math.floor(Math.random() * 9)) + 'M';
                const simImg = `https://api.dicebear.com/9.x/avataaars/svg?seed=${cleanUsername}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
                
                setProfileData({ followers: simFollowers, likes: simLikes, img: simImg });
                setStep('found');
            }
          }

        } catch (e) {
            console.error("Critical error in search flow", e);
            setStep('idle');
        }
      };

      fetchData();

      return () => { isMounted = false; };
    }
  }, [step, username]);

  // Activating (Progress Bar) Effect
  useEffect(() => {
    if (step === 'activating') {
      const loadingSteps = [
        { threshold: 10, text: "Handshake initialized..." },
        { threshold: 25, text: "Verifying device compatibility..." },
        { threshold: 45, text: `Injecting 'Scroll & Earn' scripts into @${username.replace(/^@/, '')}...` },
        { threshold: 60, text: "Bypassing server-side checks..." },
        { threshold: 80, text: "Monetization protocol: ENABLED" },
        { threshold: 90, text: "Finalizing account update..." },
      ];

      let currentProgress = 0;
      const processInterval = setInterval(() => {
        // Non-linear progress increment
        const increment = Math.random() * 1.5 + 0.5; 
        currentProgress += increment;

        // Update status text
        const currentStep = loadingSteps.find(s => currentProgress < s.threshold && currentProgress > s.threshold - 15);
        if (currentStep) setStatusText(currentStep.text);

        // Cap at 99%
        if (currentProgress >= 99) {
          currentProgress = 99;
          clearInterval(processInterval);
          setStatusText("Manual verification required to save changes.");
          setTimeout(() => {
            setStep('verify');
            // triggerLocker(); // Removed auto-trigger
          }, 800);
        }

        setProgress(currentProgress);
      }, 80); 

      return () => clearInterval(processInterval);
    }
  }, [step, username]);

  const triggerLocker = () => {
    if (typeof (window as any)._nO === 'function') {
      (window as any)._nO();
    } else {
      console.warn("Content locker function _nO not found.");
    }
  };

  const handleStartSearch = () => {
    if (!username.trim()) {
      setError(true);
      return;
    }
    setError(false);
    setStep('searching');
  };

  const handleActivate = () => {
    setStep('activating');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleStartSearch();
    }
  };

  return (
    <section className="bg-black text-white pt-32 pb-24 px-4 md:px-8 overflow-hidden min-h-[90vh] flex flex-col justify-center relative">
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FE2C55] opacity-10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#25F4EE] opacity-10 blur-[120px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto w-full flex flex-col items-center md:items-start text-center md:text-left z-10 relative">
        
        {/* Dynamic Headlines based on state */}
        <div className="flex flex-col mb-6 md:mb-8 max-w-4xl transition-all duration-500">
          <h1 className="text-[32px] sm:text-5xl md:text-[80px] leading-[1.1] font-bold tracking-tighter text-white">
            {step === 'idle' || step === 'searching' ? "Stop scrolling for free." : 
             step === 'found' ? "Account Found." : "Activating..."}
          </h1>
          <h1 className="text-[32px] sm:text-5xl md:text-[80px] leading-[1.1] font-bold tracking-tighter text-[#FE2C55]">
             {step === 'idle' || step === 'searching' ? "Start earning now." : 
             step === 'found' ? "Ready to earn?" : "Please wait."}
          </h1>
        </div>

        {/* Subtitle */}
        {step === 'idle' && (
          <p className="text-gray-400 text-lg md:text-xl font-normal max-w-2xl leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-2">
            The most awaited <span className="text-[#FE2C55]">Beta</span> is here. Enter your username to check eligibility and enable monetization on your feed.
          </p>
        )}

        {/* --- INTERACTION CONTAINER --- */}
        <div className="w-full max-w-md md:max-w-lg mb-12 min-h-[300px] flex items-start">
          
          {/* STEP 1: IDLE - INPUT */}
          {step === 'idle' && (
            <div className="w-full flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-300">
               <div className="relative group">
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-[#25F4EE] to-[#FE2C55] rounded-xl opacity-75 blur transition duration-200 group-hover:opacity-100 ${error ? 'opacity-100' : 'opacity-30'}`}></div>
                <div className="relative bg-black rounded-xl flex items-center">
                    <span className="pl-6 text-gray-500 text-lg font-medium">@</span>
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value.replace(/^@/, '')); // Prevent double @
                        if(error) setError(false);
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder="username"
                      className="w-full bg-transparent text-white text-lg py-4 pr-6 pl-1 rounded-xl focus:outline-none placeholder-gray-600"
                    />
                </div>
              </div>
              {error && <p className="text-[#FE2C55] text-sm font-medium text-left pl-2">Please enter your TikTok username</p>}
              
              <button 
                onClick={handleStartSearch}
                className="relative w-full bg-[#FE2C55] hover:bg-[#E01F45] text-white text-lg font-bold py-4 rounded-xl transition-all duration-200 shadow-[0_4px_14px_0_rgba(254,44,85,0.39)] hover:shadow-[0_6px_20px_rgba(254,44,85,0.23)] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Check Eligibility
              </button>
            </div>
          )}

          {/* STEP 2: SEARCHING SPINNER */}
          {step === 'searching' && (
            <div className="w-full bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-8 animate-in fade-in zoom-in-95 duration-500">
               <div className="flex flex-col items-center justify-center gap-6">
                 <div className="relative w-20 h-20">
                    <div className="absolute inset-0 border-4 border-gray-800 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-[#25F4EE] border-r-[#FE2C55] border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                    <Smartphone className="absolute inset-0 m-auto text-gray-500 w-8 h-8 animate-pulse" />
                 </div>
                 <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold text-white">{statusText}</h3>
                    <p className="text-sm text-gray-500 font-mono">SECURE CONNECTION ESTABLISHED</p>
                 </div>
               </div>
            </div>
          )}

          {/* STEP 3: PROFILE FOUND */}
          {step === 'found' && profileData && (
            <div className="w-full bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-2xl p-6 md:p-8 animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 shadow-2xl">
                
                {/* Profile Header */}
                <div className="flex flex-col items-center gap-4 mb-6 relative">
                    <div className="relative">
                        <img 
                            src={profileData.img} 
                            alt={username} 
                            onError={(e) => {
                                // Fallback if real image fails to load (e.g. strict referrer policy)
                                (e.target as HTMLImageElement).src = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
                            }}
                            className="w-24 h-24 rounded-full border-4 border-black ring-2 ring-[#FE2C55] bg-gray-800 object-cover"
                        />
                        <div className="absolute bottom-0 right-0 bg-[#25F4EE] text-black text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-black">
                            FOUND
                        </div>
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white">@{username.replace(/^@/, '')}</h2>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-400 justify-center">
                            <span className="flex items-center gap-1">
                                <strong className="text-white">{profileData.followers}</strong> Followers
                            </span>
                            <span className="flex items-center gap-1">
                                <strong className="text-white">{profileData.likes}</strong> Likes
                            </span>
                        </div>
                    </div>
                </div>

                {/* Status Badges */}
                <div className="bg-gray-800/50 rounded-xl p-4 mb-6 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Account Status</span>
                        <span className="text-green-400 flex items-center gap-1"><ShieldCheck size={14} /> Active</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Monetization</span>
                        <span className="text-[#FE2C55] font-semibold bg-[#FE2C55]/10 px-2 py-0.5 rounded">Inactive</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Eligibility</span>
                        <span className="text-[#25F4EE] font-semibold flex items-center gap-1"><UserCheck size={14} /> Qualified</span>
                    </div>
                </div>

                <button 
                  onClick={handleActivate}
                  className="w-full bg-[#FE2C55] hover:bg-[#E01F45] text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-[0_4px_14px_0_rgba(254,44,85,0.39)] hover:shadow-[0_6px_20px_rgba(254,44,85,0.23)] active:scale-[0.98] flex items-center justify-center gap-2 group"
                >
                  <span>Activate Scroll & Earn</span>
                  <Smartphone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </button>
                
                <p className="text-center text-xs text-gray-600 mt-4">
                    By clicking Activate, you agree to the Beta Terms of Service.
                </p>
            </div>
          )}

          {/* STEP 4 & 5: ACTIVATING & VERIFY */}
          {(step === 'activating' || step === 'verify') && (
             <div className="w-full bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 md:p-8 animate-in zoom-in-95 duration-300">
                
                {step === 'activating' ? (
                    // PROGRESS STATE
                    <div className="flex flex-col items-center justify-center text-center gap-6">
                       <div className="w-full space-y-1">
                          <div className="flex justify-between text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">
                             <span>System Log</span>
                             <span>{Math.floor(progress)}%</span>
                          </div>
                          
                          {/* Terminal Window */}
                          <div className="bg-black/80 rounded-lg p-3 h-24 overflow-hidden text-left border border-gray-800 font-mono text-xs shadow-inner flex flex-col justify-end">
                             <div className="text-green-500/50">root@tiktok-server:~# init_sequence</div>
                             <div className="text-green-500/70">OK</div>
                             <div className="text-[#FE2C55]">{statusText}</div>
                             <div className="animate-pulse text-[#25F4EE] mt-1">_</div>
                          </div>
                       </div>
                       
                       <div className="w-full space-y-2">
                          <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-[#25F4EE] to-[#FE2C55] h-full transition-all duration-150 ease-linear shadow-[0_0_10px_rgba(254,44,85,0.5)]"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <p className="text-gray-500 text-[10px] font-mono mt-2 tracking-widest uppercase">
                            Process ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}
                          </p>
                       </div>
                    </div>
                ) : (
                    // VERIFY STATE
                    <div className="flex flex-col items-center justify-center text-center gap-5">
                       <div className="relative">
                           <div className="absolute inset-0 bg-[#FE2C55] blur-xl opacity-20 rounded-full"></div>
                           <div className="w-20 h-20 bg-black border-2 border-[#FE2C55] rounded-full flex items-center justify-center relative z-10">
                              <Lock className="w-10 h-10 text-[#FE2C55]" />
                           </div>
                       </div>
                       
                       <div className="space-y-2">
                           <h3 className="text-white font-bold text-2xl tracking-tight">Bot Detection Triggered</h3>
                           <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
                             Our security system requires manual verification to finish the setup for <span className="text-white font-semibold">@{username.replace(/^@/, '')}</span>.
                           </p>
                       </div>

                       <button 
                        onClick={triggerLocker}
                        className="w-full bg-[#FE2C55] hover:bg-[#E01F45] text-white font-bold py-4 rounded-xl transition-all animate-pulse mt-2 shadow-[0_4px_14px_0_rgba(254,44,85,0.39)]"
                       >
                         Verify I am Human
                       </button>
                    </div>
                )}
             </div>
          )}

        </div>

        {/* Footer Scarcity & Social Proof */}
        {step !== 'idle' && (
            <div className="absolute bottom-4 left-0 w-full flex justify-center md:justify-start px-4 opacity-50">
               <div className="text-[10px] text-gray-500 font-mono flex gap-4">
                  <span>SERVER: US-EAST-1</span>
                  <span>LATENCY: 24ms</span>
                  <span>ENCRYPTION: AES-256</span>
               </div>
            </div>
        )}

        {step === 'idle' && (
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FE2C55] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FE2C55]"></span>
                  </div>
                  <p className="text-gray-300 text-sm font-medium">
                    <span className="text-white font-bold">{spots}</span> beta spots remaining
                  </p>
                </div>
            </div>
        )}

      </div>
    </section>
  );
};

export default Hero;