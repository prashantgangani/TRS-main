import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Edit2, CheckCircle, XCircle, Download, FileText } from 'lucide-react';
import { API_URL } from '../config';
import { logAdminAction } from '../utils/logger';
import LazyImage from '../components/LazyImage';
import UniversalImage from '/universal.jpg'

const ValidCars = ({ isAdmin }) => {
    const navigate = useNavigate();
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [pdfUrl, setPdfUrl] = useState('');
    const [newPdfUrl, setNewPdfUrl] = useState('');
    const [settings, setSettings] = useState(null);
    
    // Pagination controls for both lists
    const [visibleValidCount, setVisibleValidCount] = useState(12);
    const [visibleInvalidCount, setVisibleInvalidCount] = useState(12);
    const [search, setSearch] = useState("");
const [filter, setFilter] = useState("all");
const [expandedCards, setExpandedCards] = useState({});

    const [formData, setFormData] = useState({
    title: '',
    description: '',
    vehicles: '',
    imageUrl: '',
    isValid: true
});

const fetchCarsAndSettings = async () => {
        try {
            const [carsRes, settingsRes] = await Promise.all([
                fetch(`${API_URL}/valid-cars`),
                fetch(`${API_URL}/settings`)
            ]);
            const carsData = await carsRes.json();
            const settingsData = await settingsRes.json();

            setCars(carsData);
            setSettings(settingsData);
            setPdfUrl(settingsData.validCarsPdfUrl || '');
            setNewPdfUrl(settingsData.validCarsPdfUrl || '');
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch data:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        let mounted = true;
        fetchCarsAndSettings().then(() => {
            if (!mounted) return;
        });
        return () => { mounted = false };
    }, []);

    const handlePdfSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/settings`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ validCarsPdfUrl: newPdfUrl })
            });
            if (res.ok) {
                await logAdminAction('Updated PDF', 'Updated Valid Cars PDF Document');
                setPdfUrl(newPdfUrl);
                alert("PDF URL updated successfully!");
            }
        } catch (err) {
            console.error("Error updating PDF URL:", err);
            alert("Failed to update PDF URL.");
        }
    };

    const handleDeletePdf = async () => {
        if (!window.confirm("Are you sure you want to remove the current Valid Cars PDF?")) return;
        try {
            const res = await fetch(`${API_URL}/settings`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ validCarsPdfUrl: '' })
            });
            if (res.ok) {
                await logAdminAction('Deleted PDF', 'Removed Valid Cars PDF Document');
                setPdfUrl('');
                setNewPdfUrl('');
                alert("PDF URL removed successfully!");
            }
        } catch (err) {
            console.error("Error removing PDF URL:", err);
            alert("Failed to remove PDF URL.");
        }
    };

const handleAddOrUpdate = async (e) => {

    e.preventDefault();

    const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        vehicles: formData.vehicles.trim(),
        imageUrl: formData.imageUrl.trim(),
        isValid: formData.isValid
    };

    if (!payload.title) {
        alert("Meet Topic is required.");
        return;
    }

    try {

        const url = editingId
            ? `${API_URL}/valid-cars/${editingId}`
            : `${API_URL}/valid-cars`;

        const method = editingId
            ? "PUT"
            : "POST";

        const res = await fetch(url, {

            method,

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(payload)

        });

        const data = await res.json();

        if (!res.ok) {

            alert(data.message);

            return;

        }

        await logAdminAction(

            editingId
                ? "Updated Registry"
                : "Published Registry",

            payload.title

        );

        setEditingId(null);

        setFormData({

            title: "",

            description: "",

            vehicles: "",

            imageUrl: "",

            isValid: true

        });

        fetchCarsAndSettings();

    } catch (err) {

        console.error(err);

        alert("Something went wrong.");

    }

};

    const handleEdit = (car) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setEditingId(car._id);
        setFormData({
    title: car.title,
    description: car.description || '',
    vehicles: car.vehicles || '',
    imageUrl: car.imageUrl || '',
    isValid: car.isValid
});
    };

    const handleDelete = async (id, carName) => {
        if (!window.confirm("Are you sure you want to remove this car?")) return;
        try {
            const res = await fetch(`${API_URL}/valid-cars/${id}`, { method: 'DELETE' });
            if (res.ok) {
                await logAdminAction('Deleted Car from List', `Removed ${carName}`);
                fetchCarsAndSettings();
            }
        } catch (err) {
            console.error("Error deleting car:", err);
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({
    title: '',
    description: '',
    vehicles: '',
    imageUrl: '',
    isValid: true
});
    };
const filteredCars = [...cars]
    .filter((car) => {

        const matchesFilter =
            filter === "all" ||
            (filter === "approved" && car.isValid) ||
            (filter === "restricted" && !car.isValid);

        return matchesFilter;

    })
    .sort((a, b) => {

        if (!search.trim()) return 0;

        const query = search.toLowerCase();

        const getScore = (car) => {

    const title = (car.title || "").toLowerCase();
    const description = (car.description || "").toLowerCase();

    const vehicles = (car.vehicles || "")
        .split("\n")
        .map(v => v.trim().toLowerCase())
        .filter(Boolean);

    // Highest priority
    if (vehicles.some(v => v.startsWith(query))) return 100;

    // Vehicle contains search
    if (vehicles.some(v => v.includes(query))) return 80;

    // Topic starts with search
    if (title.startsWith(query)) return 60;

    // Topic contains search
    if (title.includes(query)) return 40;

    // Description
    if (description.includes(query)) return 20;

    return 0;
};

        return getScore(b) - getScore(a);

    });

const validCarsList = filteredCars.filter(car => car.isValid);

const invalidCarsList = filteredCars.filter(car => !car.isValid);

    const totalVehicles = cars.reduce((count, car) => {

    return count +
        (car.vehicles || "")
            .split("\n")
            .filter(v => v.trim())
            .length;

}, 0);

const approvedVehicleCount = validCarsList.reduce((count, car) => {
    return (
        count +
        (car.vehicles || "")
            .split("\n")
            .filter(v => v.trim())
            .length
    );
}, 0);

const restrictedVehicleCount = invalidCarsList.reduce((count, car) => {
    return (
        count +
        (car.vehicles || "")
            .split("\n")
            .filter(v => v.trim())
            .length
    );
}, 0);

    const fallBackImage = UniversalImage;

    const vehicleCount =
formData.vehicles
.split("\n")
.filter(v => v.trim() !== "")
.length;

const toggleCard = (id) => {
    setExpandedCards((prev) => ({
        ...prev,
        [id]: !prev[id],
    }));
};

    return (
        <div className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
            <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="mb-12 text-center"
>
    <h1 className="text-5xl md:text-7xl font-black font-heading mb-4">
        Meet
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-electric-blue to-neon-purple">
            Vehicle Registry
        </span>
    </h1>

    <p className="text-white/40 text-lg max-w-2xl mx-auto hover:text-white transition-all duration-500">
        Check the list below to see which vehicles are permitted and which are restricted for the current meet.
    </p>
</motion.div>

<div className="sticky top-24 z-30 mb-8">

    <div className="glass-panel rounded-2xl p-5">

        <input
            type="text"
            placeholder="Search Topic, Vehicle or Description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
                w-full

                bg-transparent

                text-white

                placeholder:text-white/35

                outline-none

                text-sm

                tracking-wide
            "
        />

    </div>

</div>

<div className="flex flex-wrap justify-center gap-3 mb-12">

    {[
        {
            id: "all",
            label: "All Topics"
        },
        {
            id: "approved",
            label: "Approved"
        },
        {
            id: "restricted",
            label: "Restricted"
        }
    ].map((item) => (

        <button
            key={item.id}
            onClick={() => setFilter(item.id)}
            className={`
                px-5

                py-2

                rounded-full

                uppercase

                text-xs

                tracking-[0.25em]

                font-bold

                

                transition-all

                duration-300

                ${
                    filter === item.id
                        ? "bg-neon-purple/50 text-white border border-neon-purple shadow-[0_0_20px_rgba(176,38,255,.45)]"
                        : "glass-panel border border-white/10 text-white/60  hover:border-neon-purple/40 hover:text-neon-purple"
                }
            `}
        >

            {item.label}

        </button>

    ))}

</div>

<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 group">

    <div className="glass-panel p-4 text-center">
        <div className="text-2xl font-black text-neon-green group-hover:text-white transition-all duration-500">
            {approvedVehicleCount}
        </div>
        <div className="text-xs uppercase tracking-widest text-white/50 group-hover:text-neon-green transition-all duration-500">
            Approved
        </div>
    </div>

    <div className="glass-panel p-4 text-center">
        <div className="text-2xl font-black text-neon-red group-hover:text-white transition-all duration-500">
            {restrictedVehicleCount}
        </div>
        <div className="text-xs uppercase tracking-widest text-white/50 group-hover:text-neon-red transition-all duration-500">
            Restricted
        </div>
    </div>

    <div className="glass-panel p-4 text-center">
<div className="text-2xl font-black text-electric-blue group-hover:text-white transition-all duration-500">

    {totalVehicles}

</div>

<div className="text-xs uppercase tracking-widest text-white/50 group-hover:text-electric-blue transition-all duration-500">

    Total Vehicles

</div>
    </div>

    <div className="glass-panel p-4 text-center">
        <div className="text-xl font-black text-oracle-gold group-hover:text-white transition-all duration-500">
            Live
        </div>
        <div className="text-xs uppercase tracking-widest text-white/50 group-hover:text-oracle-gold transition-all duration-500">
            Registry Status
        </div>
    </div>

</div>

            {pdfUrl && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 flex justify-center"
                >
                    <a 
                        href={pdfUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        download="Valid_Cars_List.pdf"
                        className="flex items-center gap-2 px-6 py-3 bg-neon-purple/20 text-neon-purple hover:bg-neon-purple hover:text-white border border-neon-purple font-bold tracking-widest uppercase rounded transition-colors"
                    >
                        <Download size={20} />
                        Download Valid Cars PDF
                    </a>
                </motion.div>
            )}

            {isAdmin && (!settings || settings.manageMasterLibrary !== false) && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex justify-center gap-4"
                >
                    <button
                        onClick={() => navigate('/admin/car-library')}
                        className="group relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-black tracking-widest uppercase rounded-lg overflow-hidden transition-all hover:scale-105 shadow-[0_0_20px_rgba(0,255,255,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]"
                    >
                        <div className="absolute inset-0 bg-white/20 group-hover:translate-x-[150%] -translate-x-[150%] transition-transform duration-500 ease-out skew-x-12"></div>
                        <FileText size={24} className="relative z-10 group-hover:rotate-12 transition-transform" />
                        <span className="relative z-10 drop-shadow-md">Access Master Car Library</span>
                    </button>
                </motion.div>
            )}

            {isAdmin && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-8 glass-panel p-6 rounded-lg border-2 border-neon-purple/30 max-w-3xl mx-auto relative"
                >
                    <h3 className="text-xl font-bold mb-4 font-heading text-neon-purple">
                        Admin Controls: Upload Valid Cars PDF
                    </h3>
                    <form onSubmit={handlePdfSubmit} className="flex flex-col md:flex-row gap-4">
                        <input 
                            type="url" 
                            placeholder="Cloudinary PDF URL" 
                            className="flex-1 bg-black/50 border border-white/10 rounded px-4 py-3 text-white focus:border-neon-purple outline-none"
                            value={newPdfUrl}
                            onChange={e => setNewPdfUrl(e.target.value)}
                        />
                        <button type="submit" className="px-6 py-3 bg-neon-purple/20 text-neon-purple hover:bg-neon-purple hover:text-white border border-neon-purple font-bold tracking-widest uppercase rounded transition-colors whitespace-nowrap">
                            Save PDF URL
                        </button>
                        {pdfUrl && (
                            <button 
                                type="button" 
                                onClick={handleDeletePdf}
                                className="px-6 py-3 bg-neon-red/20 text-neon-red hover:bg-neon-red hover:text-white border border-neon-red font-bold tracking-widest uppercase rounded transition-colors whitespace-nowrap"
                            >
                                Delete
                            </button>
                        )}
                    </form>
                </motion.div>
            )}

            {isAdmin && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-16 glass-panel p-6 rounded-lg border-2 border-neon-purple/30 max-w-3xl mx-auto relative"
                >
                    <h3 className="text-xl font-bold mb-4 font-heading text-neon-purple">
                        TRS Vehicle Registry Console: {editingId
    ? "Update Meet Topic"
    : "Publish Meet Topic"}
                    </h3>
                    <form onSubmit={(e) => {

        console.log(formData);

        handleAddOrUpdate(e);

    }} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
    type="text"
    placeholder="Meet Topic"
    className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-white focus:border-neon-purple outline-none"
    value={formData.title}
    onChange={(e) =>
    setFormData(prev => ({
        ...prev,
        title: e.target.value
    }))
}
/>
                            <input 
                                type="url" 
                                placeholder="Image URL (Optional)" 
                                className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-white focus:border-neon-purple outline-none"
                                value={formData.imageUrl}
                                onChange={(e) =>
    setFormData(prev => ({
        ...prev,
        imageUrl: e.target.value
    }))
}
                            />
                        </div>
                        <textarea 
                            placeholder="Description (e.g. Allowed modifications, exact trim requirements)" 
                            className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-white focus:border-neon-purple outline-none h-24"
                            value={formData.description}
                            onChange={(e) =>
    setFormData(prev => ({
        ...prev,
        description: e.target.value
    }))
}
                        />

    <label className="block mb-2 text-xs uppercase tracking-[0.3em] text-white/40">

        Vehicle List

    </label>

    <textarea
        placeholder={`Turismo Omaggio
Ignus
JB700
Monroe
Stinger TT
Stirling GT`}
        className="w-full bg-black/50 border border-white/10 rounded px-4 py-3 text-white focus:border-neon-purple outline-none h-48"
        value={formData.vehicles}
        onChange={(e) =>
            setFormData(prev => ({
    ...prev,
    vehicles: e.target.value,
}))
        }
    />
<div className="mt-2 text-xs text-neon-purple">

    {vehicleCount}

    {vehicleCount === 1 ? " Vehicle" : " Vehicles"}

</div>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    checked={formData.isValid === true} 
                                    onChange={() => setFormData(prev => ({
    ...prev,
    isValid: true
}))}
                                />
                                <span className="text-neon-green font-bold">Approved Vehicles</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    checked={formData.isValid === false} 
                                    onChange={() => setFormData({...formData, isValid: false})}
                                />
                                <span className="text-neon-red font-bold">Restricted Vehicles</span>
                            </label>
                        </div>

                        {/* Live Preview */}

<div className="glass-panel border border-neon-purple/20 rounded-xl p-6 mt-6">

    <div className="flex items-center justify-between mb-5">

        <h4 className="text-sm font-bold uppercase tracking-[0.35em] text-neon-purple">

            Live Preview

        </h4>

        <span
            className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                formData.isValid
                    ? "bg-neon-green/20 text-neon-green border border-neon-green/30"
                    : "bg-neon-red/20 text-neon-red border border-neon-red/30"
            }`}
        >

            {formData.isValid ? "Approved" : "Restricted"}

        </span>

    </div>

    <h3 className="text-3xl font-black font-heading mb-3">

        {formData.title || "Meet Topic"}

    </h3>

    <p className="text-white/60 mb-6 whitespace-pre-wrap">

        {formData.description || "Vehicles will appear here..."}

    </p>

    <div className="flex flex-wrap gap-2">

        {formData.vehicles
            .split("\n")
            .filter(v => v.trim() !== "")
            .slice(0, 12)
            .map((vehicle, index) => (

                <span
                    key={index}
                    className="
                        px-3
                        py-2

                        rounded-lg

                        glass-panel

                        text-xs

                        font-semibold

                        tracking-wide

                        hover:border-neon-purpl
                        hover:border-neon-purple

                        hover:bg-neon-purple
                        
                        hover:text-white

                        transition-all

                        duration-500
                    "
                >

                    {vehicle}

                </span>

            ))}

    </div>

    {formData.vehicles
        .split("\n")
        .filter(v => v.trim() !== "").length > 12 && (

        <div className="mt-4 text-neon-purple text-sm font-bold">

            +

            {" "}

            {formData.vehicles
                .split("\n")
                .filter(v => v.trim() !== "").length - 12}

            {" "}

            More Vehicles

        </div>

    )}

</div>
                        
                        <div className="flex gap-4 mt-4">
                            <button type="submit" className="flex-1 py-3 bg-neon-purple/20 text-neon-purple hover:bg-neon-purple hover:text-white border border-neon-purple font-bold tracking-widest uppercase rounded transition-colors">
                                {editingId ? 'Update Registry' : 'Publish Registry'}
                            </button>
                            {editingId && (
                                <button type="button" onClick={cancelEdit} className="py-3 px-6 bg-black/10 hover:bg-neon-red/80 hover:text-white text-neon-red border border-neon-red/20 font-bold tracking-widest uppercase rounded transition-all duration-300">
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </motion.div>
            )}

            {loading ? (
                <div className="text-center text-white/50 py-10 uppercase tracking-widest text-sm">Loading vehicle data...</div>
            ) : (
                <div className="space-y-20">
                    {/* Valid Cars Section */}
                    {validCarsList.length > 0 && (
                        <div>
                            <div className="flex items-center justify-center gap-3 mb-8">
                                <CheckCircle className="text-neon-green drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]" size={28} />
                                <h2 className="text-3xl font-bold font-heading text-neon-green drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]">Approved Vehicles</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                  {validCarsList.slice(0, visibleValidCount).map((car, idx) => (
                                    <motion.div 
                                        key={car._id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="
group
relative
h-full

hover:-translate-y-2

transition-all
duration-300
"
                                    >
                                        <div className="absolute -inset-0.5 bg-gradient-to-br from-green-500 to-green-900 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                                        <div className="relative h-full glass-panel bg-black/80 rounded-lg overflow-hidden border border-green-500/30 hover:border-neon-greetext-neon-green/60 transition-colors flex flex-col">
                                            <div className="relative h-64 overflow-hidden mask-image-b group-hover:mask-image-none transition-all duration-500 bg-deep-black/50 shrink-0">
                                                {isAdmin && (
                                                    <div className="absolute top-4 right-4 z-20 flex gap-2">
                                                        <button onClick={() => handleEdit(car)} className="
p-2

bg-transparent

hover:bg-electric-blue
hover:scale-110
text-electric-blue
hover:text-white

rounded-full

transition-all
duration-300

backdrop-blur-sm
">
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button onClick={() => handleDelete(car._id, car.title)} className="
p-2

bg-transparent

hover:bg-neon-red
hover:scale-110
text-neon-red
hover:text-white

rounded-full

transition-all
duration-300

backdrop-blur-sm
">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                )}
                                                <LazyImage src={car.imageUrl} fallbackSrc={fallBackImage} variant="card" alt={car.title} className="group-hover:scale-110 transition-transform duration-700 saturate-50 group-hover:saturate-100" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-transparent to-transparent opacity-90"></div>
                                            </div>
                                            <div className="p-6 relative z-10 flex-1 flex flex-col">
                                                <div className="mb-4">
                                                    <h3 className="text-2xl font-bold font-heading text-white mb-1 group-hover:text-glow-green transition-all">{car.title}</h3>
                                                </div>
                                                <div className="space-y-3 mb-2 flex-1">
                                                    <div>

    <div className="flex items-center justify-between mb-3">

        <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">

            Registry

        </p>

        <span className="text-[11px] text-neon-green font-bold">

            {car.vehicles
                .split("\n")
                .filter(v => v.trim() !== "")
                .length}

            {" "}Vehicles

        </span>

    </div>

    <p className="text-sm text-white/70 leading-relaxed mb-5 whitespace-pre-wrap">

        {car.description}

    </p>


    <div
    className={`
        flex
        flex-wrap
        gap-2

        overflow-hidden

        transition-all
        duration-500

        ${
            expandedCards[car._id]
                ? ""
                : "max-h-[96px]"
        }
    `}
>

        {(car.vehicles || "")
    .split("\n")
    .filter(v => v.trim() !== "")
    .slice(
        0,
        expandedCards[car._id]
            ? undefined
            : 8
    )
    .map((vehicle, index) => {

        const isMatch =
            search.trim() !== "" &&
            vehicle.toLowerCase().includes(search.trim().toLowerCase());

        return (

                <span
    key={index}
    className={`
        px-3
        py-2

        rounded-lg

        border

        text-xs

        font-semibold

        transition-all
        duration-300

        ${
            isMatch
                ? `
                    bg-neon-green/20
                    border-neon-green
                    text-neon-green
                    hover:border-neon-green
                    hover:bg-neon-green
                    hover:text-white
                    shadow-[0_0_18px_rgba(34,197,94,.65)]
                  `
                : `
                    bg-white/5
                    border-white/10
                    text-neon-green
                    hover:border-neon-green
                    hover:bg-neon-green
                    hover:text-white
                  `
        }
    `}
>
    {vehicle}
</span>

            );
        })}

    </div>

    {(car.vehicles || "")
    .split("\n")
    .filter(v => v.trim() !== "")
    .length > 8 && (

        <button

    onClick={() => toggleCard(car._id)}

    className="
        mt-5
        w-full
        rounded-xl
        border
        border-white/10
        bg-white/5
        py-3
        text-xs
        text-neon-green
        font-bold
        uppercase
        tracking-[0.3em]
        transition-all
        duration-300
        hover:border-neon-green
        hover:bg-neon-green
        hover:text-white
    "

>

    {expandedCards[car._id]

        ? "▲ Show Less"

        : "▼ Show All Vehicles"}

</button>

)}



</div>
                                                    {isAdmin && car.sourceLibraryId && (
                                                        <div className="mt-2">
                                                            <span className="text-[10px] py-1 px-2 border border-neon-blue/30 text-neon-blue bg-neon-blue/10 rounded uppercase tracking-wider font-bold">
                                                                From Library
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>                              {validCarsList.length > visibleValidCount && (
                                  <div className="mt-8 flex justify-center">
                                      <button
                                          onClick={(e) => {
                                              e.preventDefault();
                                              const currentScrollY = window.scrollY;
                                              setVisibleValidCount(prev => prev + 12);
                                              setTimeout(() => {
                                                  window.scrollTo({
                                                      top: currentScrollY,
                                                      behavior: "instant"
                                                  });
                                              }, 5);
                                          }}
                                          className="px-6 py-3 border border-white/20 hover:border-neon-greetext-neon-green hover:text-neon-green transition-all uppercase tracking-widest text-sm font-bold rounded-sm text-white"
                                      >
                                          Load More
                                      </button>
                                  </div>
                              )}                        </div>
                    )}

                    {/* Invalid Cars Section */}
                    {invalidCarsList.length > 0 && (
                        <div>
                            <div className="flex items-center justify-center gap-3 mb-8">
                                <XCircle className="text-neon-red drop-shadow-[0_0_8px_rgba(255,51,102,0.5)]" size={28} />
                                <h2 className="text-3xl font-bold font-heading text-neon-red drop-shadow-[0_0_8px_rgba(255,51,102,0.5)]">Restricted Vehicles</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                  {invalidCarsList.slice(0, visibleInvalidCount).map((car, idx) => (
                                    <motion.div 
                                        key={car._id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="
group
relative
h-full

hover:-translate-y-2

transition-all
duration-300
"
                                    >
                                        <div className="absolute -inset-0.5 bg-gradient-to-br from-red-500 to-red-900 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                                        <div className="relative h-full glass-panel bg-black/80 rounded-lg overflow-hidden border border-red-500/30 hover:border-red-400/60 transition-colors flex flex-col">
                                            <div className="relative h-64 overflow-hidden mask-image-b group-hover:mask-image-none transition-all duration-500 bg-deep-black/50 shrink-0">
                                                {isAdmin && (
                                                    <div className="absolute top-4 right-4 z-20 flex gap-2">
                                                        <button onClick={() => handleEdit(car)} className="
p-2

bg-transparent

hover:bg-electric-blue
hover:scale-110
text-electric-blue
hover:text-white

rounded-full

transition-all
duration-300

backdrop-blur-sm
">
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button onClick={() => handleDelete(car._id, car.title)} className="
p-2

bg-transparent

hover:bg-neon-red
hover:scale-110
text-neon-red
hover:text-white

rounded-full

transition-all
duration-300

backdrop-blur-sm
">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                )}
                                                <LazyImage src={car.imageUrl} fallbackSrc={fallBackImage} variant="card" alt={car.title} className="group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-transparent to-transparent opacity-90"></div>
                                            </div>
                                            <div className="p-6 relative z-10 flex-1 flex flex-col">
                                                <div className="mb-4">
                                                    <h3 className="text-2xl font-bold font-heading text-white mb-1 group-hover:text-glow-red transition-all">{car.title}</h3>
                                                </div>
                                                <div className="space-y-3 mb-2 flex-1">
                                                    <div>

    <div className="flex items-center justify-between mb-3">

        <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">

            Registry

        </p>

        <span className="text-[11px] text-neon-red font-bold">

            {(car.vehicles || "")
                .split("\n")
                .filter(v => v.trim())
                .length}

            {" "}Vehicles

        </span>

    </div>

    <p className="text-sm italic text-white/70 whitespace-pre-wrap mb-5">

        {car.description}

    </p>

    <div
        className={`
            flex
            flex-wrap
            gap-2

            overflow-hidden

            transition-all
            duration-500

            ${
                expandedCards[car._id]
                    ? ""
                    : "max-h-[96px]"
            }
        `}
    >

        {(car.vehicles || "")
            .split("\n")
            .filter(v => v.trim())
            .map((vehicle, index) => {

    const isMatch =
        search.trim() !== "" &&
        vehicle.toLowerCase().includes(search.trim().toLowerCase());

    return (

                <span
    key={index}
    className={`
        px-3
        py-2

        rounded-lg

        border

        text-xs

        font-semibold

        transition-all
        duration-300

        ${
            isMatch
                ? `
                    bg-neon-red/20
                    border-neon-red
                    text-neon-red
                    hover:border-neon-red
                    hover:bg-neon-red
                    hover:text-white
                    shadow-[0_0_18px_rgba(239,68,68,.65)]
                  `
                : `
                    bg-white/5
                    border-white/10
                    text-neon-red
                    hover:border-neon-red
                    hover:bg-neon-red
                    hover:text-white
                  `
        }
    `}
>
    {vehicle}
</span>
);
})

            }

    </div>

    {(car.vehicles || "")
        .split("\n")
        .filter(v => v.trim())
        .length > 8 && (

        <button

            onClick={() => toggleCard(car._id)}

            className="
                mt-5
                w-full
                rounded-xl
                border
                border-white/10
                bg-white/5
                py-3
                text-xs
                font-bold
                text-neon-red
                uppercase
                tracking-[0.3em]
                transition-all
                duration-300
                hover:border-neon-red
                hover:bg-neon-red
                hover:text-white
            "

        >

            {expandedCards[car._id]

                ? "▲ Show Less"

                : "▼ Show All Vehicles"}

        </button>

    )}

</div>
                                                    {isAdmin && car.sourceLibraryId && (
                                                        <div className="mt-2">
                                                            <span className="text-[10px] py-1 px-2 border border-neon-blue/30 text-neon-blue bg-neon-blue/10 rounded uppercase tracking-wider font-bold">
                                                                From Library
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            {invalidCarsList.length > visibleInvalidCount && (
                                <div className="mt-8 flex justify-center">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const currentScrollY = window.scrollY;
                                            setVisibleInvalidCount(prev => prev + 12);
                                            setTimeout(() => {
                                                window.scrollTo({
                                                    top: currentScrollY,
                                                    behavior: "instant"
                                                });
                                            }, 5);
                                        }}
                                        className="px-6 py-3 border border-white/20 hover:border-neon-red hover:text-neon-red transition-all uppercase tracking-widest text-sm font-bold rounded-sm text-white"
                                    >
                                        Load More
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {validCarsList.length === 0 && invalidCarsList.length === 0 && (
                        <p className="text-white/40 italic text-center py-10">No car regulations have been defined yet.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ValidCars;
