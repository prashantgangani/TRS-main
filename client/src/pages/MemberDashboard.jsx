import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, LogOut, Check, AlertCircle, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import LazyImage from '../components/LazyImage';

const MemberDashboard = ({ setAuthContext }) => {
    const [garageCard, setGarageCard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        carName: '',
        imageUrl: '',
        imageFile: null
    });
    const [previewUrl, setPreviewUrl] = useState('');
    const hasChanges =
    formData.carName !== garageCard?.carName ||
    formData.imageUrl !== garageCard?.image ||
    !!formData.imageFile;

    useEffect(() => {
        const fetchGarageCard = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('No auth token');

                const res = await fetch(`${API_URL}/member-system/garage/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.status === 401 || res.status === 403) {
                    handleLogout();
                    return;
                }

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.message || 'Failed to fetch your garage card');
                }

                const data = await res.json();
                setGarageCard(data);
                setFormData({
                    carName: data.carName || '',
                    imageUrl: data.image || '',
                    imageFile: null
                });
                setPreviewUrl(data.image || '');
            } catch (err) {
                setMessage({ text: err.message, type: 'error' });
            } finally {
                setLoading(false);
            }
        };

        fetchGarageCard();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('trs_role');
        localStorage.removeItem('trs_username');
        localStorage.removeItem('trs_tournament_member_role');
        localStorage.removeItem('trs_tournament_acceptance');
        localStorage.removeItem('trs_tournament_participant');
        if (setAuthContext) setAuthContext('user');
        navigate('/member-login');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ text: '', type: '' });

        try {
            const token = localStorage.getItem('token');
            const data = new FormData();
            data.append('carName', formData.carName);
            if (formData.imageFile) {
                data.append('image', formData.imageFile);
            } else if (formData.imageUrl) {
                data.append('imageUrl', formData.imageUrl);
            }

            const res = await fetch(`${API_URL}/member-system/garage/me`, {
                method: 'PATCH',
                headers: { 
                    'Authorization': `Bearer ${token}`
                },
                body: data
            });

            const resData = await res.json();
            if (!res.ok) throw new Error(resData.message || 'Failed to update garage card');

            setGarageCard(resData);
            setFormData(prev => ({
                ...prev,
                imageUrl: resData.image || '',
                imageFile: null
            }));
            setPreviewUrl(resData.image || '');
            setMessage({ text: 'Garage Card sync successful.', type: 'success' });
        } catch (err) {
            setMessage({ text: err.message, type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                setMessage({ text: 'Image size should be less than 1MB', type: 'error' });
                return;
            }
            setFormData(prev => ({ ...prev, imageFile: file }));
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-deep-black text-white flex items-center justify-center pt-32 pb-32 uppercase tracking-widest text-lg">Initializing Workspace...</div>;
    }

    return (
        <div className="min-h-screen bg-deep-black text-white selection:bg-neon-purple/50 pt-24 pb-20">
            <div className="max-w-6xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12"
                >
                    <div>

    <div className="flex items-center justify-between mb-5">

    {/* Left */}
    <div className="flex items-center gap-3">

        <div
            className="
            w-2
            h-2

            rounded-full

            bg-electric-blue

            animate-pulse

            shadow-[0_0_12px_rgba(0,229,255,0.9)]
            "
        />

        <span
            className="
            text-electric-blue/80

            text-xs

            uppercase

            tracking-[0.35em]

            font-bold
            "
        >
            Member Terminal
        </span>

    </div>

</div>

    <h1
        className="
        text-4xl
        md:text-6xl

        font-black
        font-heading

        tracking-tight

        mb-2
        "
    >

        <span
            className="
            bg-gradient-to-r

            from-white
            via-electric-blue
            to-neon-purple

            bg-clip-text

            text-transparent
            "
        >
            Garage
        </span>

        <span className="text-white">
            {" "}Terminal
        </span>

    </h1>

    <div className="flex items-center gap-2 mt-4">

    <div
        className={`
        w-2
        h-2

        rounded-full

        animate-pulse

        ${
            hasChanges
                ? 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]'
                : 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]'
        }
        `}
    />

    <span
        className={`
        text-[10px]

        uppercase

        tracking-[0.3em]

        font-bold

        ${
            hasChanges
                ? 'text-yellow-400'
                : 'text-green-400'
        }
        `}
    >
        {hasChanges
            ? 'Unsaved Changes'
            : 'Garage Synchronized'}
    </span>

</div>

    

</div>
                    <button 
                        onClick={handleLogout}
                        className="
group

inline-flex
items-center
gap-3

px-6
py-3

rounded-lg

border
border-neon-red/20

bg-neon-red/5

text-neon-red

font-bold

uppercase

tracking-widest

transition-all
duration-300

hover:text-white/80
hover:bg-neon-red/80
hover:border-neon-red

hover:-translate-y-1

hover:shadow-[0_0_25px_rgba(239,68,68,0.25)]
"
                    >
                        <LogOut
    size={16}
    className="group-hover:-rotate-12 transition-transform duration-300"
/> DISCONNECT
                    </button>
                </motion.div>

                <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="
    grid

    grid-cols-1
    md:grid-cols-3

    gap-4

    mb-12
    "
>

    <div
        className="
group

relative

overflow-hidden

glass-panel

rounded-lg

border
border-white/10

p-5

cursor-default

transition-all
duration-300

hover:-translate-y-2
hover:scale-[1.02]

hover:border-electric-blue/40

hover:bg-electric-blue/[0.03]

hover:shadow-[0_20px_40px_rgba(0,229,255,0.12)]
"
    >
        <div
className="
absolute

top-0
right-0

w-20
h-20

bg-electric-blue/10

blur-3xl

opacity-0

group-hover:opacity-100

transition-all
duration-500
"
/>

        <p
className="
text-[10px]

uppercase

tracking-[0.3em]

text-white/40

transition-all
duration-300

group-hover:text-white/70
group-hover:tracking-[0.4em]
"
>
    Username
</p>

        <div className="relative mt-2">

    <div
    className="
    absolute

    left-0
    top-1/2

    w-24
    h-8

    bg-electric-blue/20

    blur-2xl

    opacity-0

    group-hover:opacity-100

    transition-all
    duration-500

    -translate-y-1/2
    "
    />

    <h3
    className="
    relative

    text-xl

    font-black

    transition-all
    duration-300

    group-hover:text-electric-blue
    group-hover:tracking-wide
    "
    >
        {localStorage.getItem('trs_username')}
    </h3>

</div>

    </div>

    <div
        className="
group

glass-panel

rounded-lg

border
border-white/10

p-5

cursor-default

transition-all
duration-300

hover:-translate-y-2
hover:scale-[1.02]

hover:border-neon-purple/40

hover:bg-neon-purple/[0.03]

hover:shadow-[0_20px_40px_rgba(176,38,255,0.12)]
"
    >

        <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
            Role
        </p>

        <h3
className="
text-xl

font-black

mt-2

text-neon-purple

transition-all
duration-300

group-hover:tracking-wide
"
>
            {localStorage.getItem('trs_role')}
        </h3>

    </div>

    <div
        className="
group

glass-panel

rounded-lg

border
border-white/10

p-5

cursor-default

transition-all
duration-300

hover:-translate-y-2
hover:scale-[1.02]

hover:border-green-400/40

hover:bg-green-400/[0.03]

hover:shadow-[0_20px_40px_rgba(74,222,128,0.12)]
"
    >

        <div className="flex items-center gap-2">

            <div className="relative">

    <div
    className="
    absolute

    inset-0

    rounded-full

    bg-green-400

    blur-md

    opacity-70

    animate-pulse
    "
    />

    <div
    className="
    relative

    w-2
    h-2

    rounded-full

    bg-green-400
    "
    />

</div>

            <span
                className="
                text-[10px]

                uppercase

                tracking-[0.3em]

                text-green-400
                "
            >
                Connected
            </span>

        </div>

        <h3
className="
text-xl

font-black

mt-2

transition-all
duration-300

group-hover:text-green-400
group-hover:tracking-wide
"
>
            Garage Linked
        </h3>

    </div>

</motion.div>

                {message.text && (

<motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35 }}
    className={`
    glass-panel

    rounded-lg

    border

    p-5

    mb-8

    flex

    items-center

    justify-between

    ${
        message.type === 'error'
            ? 'border-red-500/30'
            : 'border-green-400/30'
    }
    `}
>

<div className="flex items-center gap-4">

    <div
        className={`
        w-3
        h-3

        rounded-full

        animate-pulse

        ${
            message.type === 'error'
                ? 'bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.8)]'
                : 'bg-green-400 shadow-[0_0_12px_rgba(74,222,128,0.8)]'
        }
        `}
    />

    <div>

        <p
            className={`
            text-[10px]

            uppercase

            tracking-[0.3em]

            font-bold

            ${
                message.type === 'error'
                    ? 'text-red-400'
                    : 'text-green-400'
            }
            `}
        >
            {message.type === 'error'
                ? 'Synchronization Failed'
                : 'Synchronization Complete'}
        </p>

        <p className="text-white mt-1">
            {message.text}
        </p>

    </div>

</div>

<div>

    {message.type === 'error'
        ? (
            <AlertCircle
                size={22}
                className="text-red-400"
            />
        )
        : (
            <Check
                size={22}
                className="text-green-400"
            />
        )
    }

</div>

</motion.div>

)}

                {!garageCard && !loading && message.type !== 'error' ? (
                    <div className="text-center p-12 border border-white/5 bg-white/5 rounded-lg">
                        <p className="text-white/50 mb-4 tracking-widest uppercase">No associated garage card found.</p>
                        <p className="text-sm text-white/30">Please contact a superadmin to link your profile to a vehicle.</p>
                    </div>
                ) : garageCard && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
                        {/* Editor Form */}
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="
glass-panel

group

border
border-white/10

rounded-lg

p-8

hover:border-electric-blue/40

hover:shadow-[0_20px_60px_rgba(0,229,255,0.08)]

hover:bg-electric-blue/[0.02]

hover:-translate-y-1

transition-all
duration-300
"
                        >
                            <div className="flex items-center justify-between mb-8">

    <div>

        <div className="flex items-center gap-3 mb-2">

            <div
            className="
            w-2
            h-2

            rounded-full

            bg-electric-blue

            animate-pulse
            "
            />

            <span
            className="
            text-[10px]

            uppercase

            tracking-[0.35em]

            text-electric-blue/80

            font-bold
            "
            >
                Configuration Matrix
            </span>

        </div>

        <h2
        className="
        text-2xl

        font-black

        font-heading

        tracking-tight
        "
        >
            Vehicle Identity Matrix
        </h2>

    </div>

    <Save
        size={22}
        className="text-electric-blue"
    />

</div>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div
className="
glass-panel

rounded-lg

border
border-white/10

hover:border-electric-blue/30

transition-all
duration-300

p-8

mb-8
"
>

<div className="flex items-center gap-3 mb-6">

<div
className="
w-2
h-2

rounded-full

bg-electric-blue

animate-pulse
"/>

<h2
className="
uppercase

tracking-[0.3em]

text-xs

font-bold

text-electric-blue/80
"
>
Vehicle Identity
</h2>

</div>
                                <div>
                                    <label className="flex items-center gap-2 mb-3">

<span
className="
text-[10px]

uppercase

tracking-[0.25em]

text-white/50

font-bold
"
>
Build Designation
</span>

<div className="flex justify-end mt-2">

<span
className="
text-[10px]

uppercase

tracking-widest

text-white/30
"
>
{formData.carName.length}/45
</span>

</div>

</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3.5 text-white focus:outline-none hover:border-electric-blue/40 hover:shadow-[0_0_20px_rgba(0,229,255,0.08)] focus:border-neon-purple transition-all duration-300 text-sm"
                                        placeholder="e.g. Pegassi Zentorno - Time Attack Build"
                                        value={formData.carName}
                                        onChange={(e) => setFormData(prev => ({...prev, carName: e.target.value}))}
                                        required 
                                    />
                                    <p className="text-white/30 text-xs mt-4 mb-4">The public name displayed for your vehicle.</p>
                                </div>
                                
                                <div
>

    <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleImageChange}
        className="
        w-full
        
        bg-black/40

        border
        border-white/10

        rounded-lg

        px-5
        py-3

        text-sm

        text-white

        hover:border-electric-blue/40

        transition-all

        file:mr-4
        file:px-4
        file:py-2

        file:rounded-full

        file:border-0

        file:bg-neon-purple/20

        file:text-neon-purple
        
        file:shadow-[0_0_10px_rgba(176,38,255,0.3)]

        file:text-xs

        file:font-bold

        hover:file:bg-neon-purple/50
        hover:file:text-white

        duration-500
        "
    />

    <div className="flex items-center gap-3 my-5">

        <div className="flex-1 h-px bg-white/10"/>

        <span
        className="
        text-[10px]

        uppercase

        tracking-[0.3em]

        text-white/30
        "
        >
            OR
        </span>

        <div className="flex-1 h-px bg-white/10"/>

    </div>

    <input
        type="url"
        value={formData.imageUrl}
        disabled={!!formData.imageFile}
        onChange={(e) => {
            setFormData(prev => ({
                ...prev,
                imageUrl: e.target.value,
                imageFile: null
            }));

            setPreviewUrl(e.target.value);
        }}
        className="
        w-full

        bg-black/40

        border
        border-white/10

        rounded-lg

        px-5
        py-3

        text-sm

        text-white

        disabled:opacity-50

        hover:border-electric-blue/40

        focus:outline-none

        focus:border-neon-purple

        transition-all
        "
        placeholder="Discord CDN / Direct Image URL"
    />

    <p className="text-white/30 text-xs mt-4">
        Upload a screenshot (max 1MB) or paste a direct image URL.
    </p>

</div>
                                </div>

                                <button
    type="submit"
    disabled={
        saving ||
        (
            formData.carName === garageCard.carName &&
            formData.imageUrl === garageCard.image &&
            !formData.imageFile
        )
    }
    className="
    relative

    w-full

    overflow-hidden

    rounded-lg

    py-4

    bg-gradient-to-r
    from-neon-purple
    via-[#b026ff]
    to-electric-blue

    text-white

    font-bold

    uppercase

    tracking-[0.25em]

    shadow-[0_0_20px_rgba(176,38,255,0.35)]

    transition-all
    duration-300

    hover:-translate-y-1
    hover:scale-[1.02]
    active:scale-[0.98]

    hover:shadow-[0_0_40px_rgba(176,38,255,0.55)]

    disabled:opacity-40
    disabled:cursor-not-allowed

    group
    "
>

    {/* Shimmer */}
    <span
        className="
        absolute
        inset-0

        bg-gradient-to-r

        from-transparent
        via-white/20
        to-transparent

        -skew-x-12

        -translate-x-full

        group-hover:translate-x-[200%]

        transition-transform
        duration-700
        "
    />

    <span
        className="
        relative

        z-10

        flex

        items-center

        justify-center

        gap-3
        "
    >

        {saving ? (
            <>

                <div
                    className="
                    w-2
                    h-2

                    rounded-full

                    bg-white

                    animate-pulse
                    "
                />

                SYNCHRONIZING...

            </>
        ) : (
            <>
                <Save size={18} />
                SYNCHRONIZE GARAGE
            </>
        )}

    </span>

</button>
                            </form>
                        </motion.div>

                        {/* Real-time Preview */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="w-full"
                        >
                            <div className="flex items-center justify-between mb-5">

    <div>

        <div className="flex items-center gap-3 mb-2">

            <div
                className="
                w-2
                h-2

                rounded-full

                bg-neon-purple

                animate-pulse

                shadow-[0_0_12px_rgba(176,38,255,0.8)]
                "
            />

            <span
                className="
                text-[10px]

                uppercase

                tracking-[0.35em]

                font-bold

                text-neon-purple/80
                "
            >
                Live Garage Card
            </span>

        </div>

        <h2
            className="
            text-2xl

            font-heading

            font-black

            tracking-tight
            "
        >
            Live Synchronization
        </h2>

    </div>

    <div
        className="
        flex

        items-center

        gap-2

        px-4
        py-2

        rounded-full

        border
        border-green-400/20

        bg-green-400/10
        "
    >

        <div
            className="
            w-2
            h-2

            rounded-full

            bg-green-400

            animate-pulse
            "
        />

        <span
            className="
            text-[10px]

            uppercase

            tracking-[0.25em]

            font-bold

            text-green-400
            "
        >
            Connected
        </span>

    </div>

</div>
                            <div className="
group

relative

aspect-[16/11]

rounded-lg

overflow-hidden

glass-panel

border
border-white/10

hover:border-electric-blue/40

shadow-[0_10px_30px_rgba(0,0,0,0.5)]

hover:shadow-[0_20px_50px_rgba(0,229,255,0.15)]

transition-all
duration-500

hover:-translate-y-2
hover:rotate-[0.3deg]
">
                                <LazyImage
                                    src={previewUrl || formData.imageUrl}
                                    variant="detail"
                                    fallbackSrc="https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=1920&q=80&auto=format&fit=crop"
                                    alt={formData.carName || "Live Preview"}
                                    className="
transition-all
duration-700

group-hover:scale-[1.08]

group-hover:brightness-110

group-hover:saturate-125
"
                                />
                            
                                {/* Subtle Gradient Overlays */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
                                <div className="absolute inset-0 bg-gradient-to-tr from-electric-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                                <div
className="
absolute

-right-20
-top-20

w-60
h-60

rounded-full

bg-electric-blue/15

blur-[120px]

opacity-0

group-hover:opacity-100

transition-all
duration-700
"
/>
                                <div
className="
absolute

top-5
right-5

z-30

px-3
py-2

rounded-full

bg-black/50

hover:border-electric-blue/50

hover:bg-electric-blue/10

transition-all

backdrop-blur

border
border-electric-blue/20

duration-500
"
>

    <div className="flex items-center gap-2">

        <div
        className="
        w-2
        h-2

        rounded-full

        bg-electric-blue

        animate-pulse
        "
        />

        <span
        className="
        text-[9px]

        uppercase

        tracking-[0.25em]

        text-electric-blue

        group-hover:text-white

        transition-all

        duration-500
        "
        >
            Live Feed
        </span>

    </div>

</div>

<div
className="
absolute

left-0
top-0

w-full
h-full

pointer-events-none

overflow-hidden

opacity-0

group-hover:opacity-100

transition-opacity
duration-500
"
>

    <div
    className="
    absolute

    -top-20

    left-0

    w-full
    h-24

    bg-gradient-to-b

    from-transparent
    via-electric-blue/20
    to-transparent

    blur-xl

    animate-scanline
    "
    />

</div>

<div
className="
absolute

top-5
left-5

z-30

rounded-2xl

border
border-white/10

bg-black/40

backdrop-blur-xl

px-4
py-3

opacity-0

group-hover:opacity-100

translate-y-3

group-hover:translate-y-0

transition-all
duration-500
"
>

<p
className="
text-[9px]

uppercase

tracking-[0.35em]

text-electric-blue

font-bold
"
>
TRS Underground
</p>

<p
className="
mt-1

text-xs

uppercase

tracking-[0.25em]

text-white/70
"
>
Live Preview
</p>

</div>
                                {/* Content */}
                                <div className="absolute bottom-0 left-0 w-full px-8 pb-8 pt-20 z-20 flex flex-col justify-end transform transition-transform duration-500 group-hover:-translate-y-1">
                                    <div className="flex items-center gap-3 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="w-8 h-[2px] bg-electric-blue shadow-[0_0_8px_rgba(0,229,255,0.8)]"></div>
                                        <p
className="
text-[11px]

uppercase

tracking-[0.35em]

font-black

text-electric-blue

truncate

transition-all
duration-500

group-hover:tracking-[0.45em]

group-hover:drop-shadow-[0_0_12px_rgba(0,229,255,0.8)]
"
>
                                            {garageCard?.builtBy || localStorage.getItem('trs_username')}
                                        </p>
                                    </div>
                                    <h3 className="
text-2xl
md:text-3xl

font-black

font-heading

italic

tracking-tight

text-white

drop-shadow-xl

truncate

transition-all
duration-500

group-hover:text-transparent

group-hover:bg-gradient-to-r
group-hover:from-white
group-hover:to-electric-blue

group-hover:bg-clip-text

group-hover:tracking-wide

group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.35)]
">
                                        {formData.carName || "VEHICLE NAME"}
                                    </h3>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MemberDashboard;