import React from 'react';

export const TerminalWelcome = () => {
    return (
        <div className="mb-6 animate-in fade-in duration-700">
            <div className="mb-4 hidden sm:flex items-start gap-8 overflow-x-auto">
                <pre className="shrink-0 mt-2 text-xs sm:text-sm font-bold opacity-90" style={{ color: 'var(--terminal-prompt-user)' }}>
{`
 ___ _        _ _  __      _      
/ __| |_  ___| | |/ _|___ | |(_)___   
\\__ \\ ' \\/ -_) | |  _/ _ \\| | |/ _ \\  
|___/_||_\\___|_|_|_| \\___/|_| |\\___/  
`}
                </pre>
                <pre className="shrink-0 text-[6px] leading-[7px] sm:text-[7px] sm:leading-[8px] font-bold opacity-90" style={{ color: 'var(--terminal-prompt-user)' }}>
{`
                      ...                     
                 .:*%@@%@%*=:.                
              ..:#%%%#%%%%####:.              
            ..:=%%%=----=----#%=..            
           .:::#@@*--:::::::-+%*-:..          
         ..:::-#@@#=-::::::--=%+::::..        
        ..:::::-=*====+=:-=++=*-:::::.        
        .:::::::-+=-:::::-----+:::::::.       
       .:::::::::-=-:::----:---:::::::..      
       .:::::::::++=--=++++--=:::::::::.      
       .:::::::::-=+=--=====+-:::::::::.      
       .:::::::::=-=++=---=+=:::::::::..      
       ..::::::-#%=:-=*####:::::::::::..      
        .::-+%%%@%%*-::--=*@@%*=:::::..       
        ..#%%@@%%@%%%%=--=#@@%%@%=::..        
          .=%@@%@@@@@%@@@%@@@@@%%%=..         
            .*%%%%%%%%%@@@@%%%%%#=.           
              .:*%%%%%%%%@@%%%=..             
                  ..:====-:..                                                            
`}
                </pre>
            </div>
            <div className="space-y-2 opacity-90">
                <p>Welcome to <strong style={{ color: 'var(--terminal-prompt-user)' }}>Shellfolio OS v3.1.7</strong>.</p>
                <p>Type <strong style={{ color: 'var(--terminal-prompt-path)' }}>'help'</strong> for shortcuts (about, projects, contact, and more), or use shell commands like <strong style={{ color: 'var(--terminal-prompt-path)' }}>cd</strong>, <strong style={{ color: 'var(--terminal-prompt-path)' }}>ls</strong>, and <strong style={{ color: 'var(--terminal-prompt-path)' }}>cat</strong> to explore the filesystem.</p>
                <p className="text-sm opacity-60 mt-4 mb-2">System booted successfully -- all services running.</p>
            </div>
        </div>
    );
};
