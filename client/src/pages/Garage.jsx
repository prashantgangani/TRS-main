import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Edit2, X, Search, Shuffle, MoveLeft, MoveRight, EyeOff, Eye, RefreshCw, ArrowRight } from 'lucide-react';
import { API_URL } from '../config';
import { logAdminAction } from '../utils/logger';
import LazyImage from '../components/LazyImage';

const Garage = ({ isAdmin, isSuperAdmin, canArrangeGarage, canHideGarageCars, isHiddenMode }) => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [carName, setCarName] = useState('');
    const [builtBy, setBuiltBy] = useState('');
    const [image, setImage] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Arrange State
    const [isArrangeMode, setIsArrangeMode] = useState(false);
    const [isSavingOrder, setIsSavingOrder] = useState(false);

    // Search State
    const [searchOwner, setSearchOwner] = useState('');

    // Pagination / Load More state
    const [visibleCount, setVisibleCount] = useState(12);
    const [selectedCar, setSelectedCar] = useState(null);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const url = isHiddenMode 
                    ? `${API_URL}/featured-cars?hidden=true` 
                    : `${API_URL}/featured-cars?hidden=false`;
                const response = await fetch(url);
                const data = await response.json();
                setCars(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch featured cars:", error);
                setLoading(false);
            }
        };
        fetchCars();
    }, [isHiddenMode]);

    const handleAddOrUpdateCar = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const randomImages = [
                'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=1920&q=80&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1542362567-b07e54358753?w=1920&q=80&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1611016186353-9af58c69a533?w=1920&q=80&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1920&q=80&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1920&q=80&auto=format&fit=crop'
            ];
            const defaultImage = randomImages[Math.floor(Math.random() * randomImages.length)];

            const payload = {
                carName,
                builtBy,
                image: image || defaultImage
            };

            if (editingId) {
                const response = await fetch(`${API_URL}/featured-cars/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const updatedCar = await response.json();
                await logAdminAction('Updated Garage Car', `Car: ${updatedCar.carName} | Owner: ${updatedCar.builtBy}`);
                setCars(cars.map(c => c._id === editingId ? updatedCar : c));
                setEditingId(null);
            } else {
                const response = await fetch(`${API_URL}/featured-cars`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const newCar = await response.json();
                await logAdminAction('Added Garage Car', `Car: ${newCar.carName} | Owner: ${newCar.builtBy}`);
                setCars([newCar, ...cars]);
            }

            // Reset form
            setCarName(''); setBuiltBy(''); setImage('');
            setIsFormOpen(false);
        } catch (error) {
            console.error("Error saving garage car:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (car) => {
        setEditingId(car._id);
        setCarName(car.carName);
        setBuiltBy(car.builtBy);
        setImage(car.image);
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this car?")) return;
        try {
            const response = await fetch(`${API_URL}/featured-cars/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                const deletedCar = cars.find(c => c._id === id);
                await logAdminAction('Deleted Garage Car', `Removed: ${deletedCar?.carName} | Owner: ${deletedCar?.builtBy}`);
                setCars(cars.filter(c => c._id !== id));
            }
        } catch (error) {
            console.error("Error deleting garage car:", error);
        }
    };

    const handleShuffle = async () => {
        if (!window.confirm("Shuffle all garage cars? This will randomize their order for everyone.")) return;
        setIsSavingOrder(true);
        try {
            const response = await fetch(`${API_URL}/featured-cars/shuffle`, { method: 'PUT' });
            if (response.ok) {
                const reFetched = await fetch(`${API_URL}/featured-cars`).then(res => res.json());
                setCars(reFetched);
                await logAdminAction('Shuffled Garage Cars', `Super Admin shuffled all garage cars.`);
            }
        } catch (error) {
            console.error("Error shuffling cars:", error);
        } finally {
            setIsSavingOrder(false);
        }
    };

    const handleMove = async (carId, direction) => {
        const index = cars.findIndex(c => c._id === carId);
        if (index === -1) return;
        if (direction === 'left' && index === 0) return;
        if (direction === 'right' && index === cars.length - 1) return;

        const newCars = [...cars];
        const swapIndex = direction === 'left' ? index - 1 : index + 1;

        // Visual Optimistic update
        const tempObj = newCars[index];
        newCars[index] = newCars[swapIndex];
        newCars[swapIndex] = tempObj;
        setCars(newCars);

        try {
            const orderedIds = newCars.map(c => c._id);
            await fetch(`${API_URL}/featured-cars/reorder`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderedIds })
            });
        } catch (error) {
            console.error("Failed to update arrangement:", error);
        }
    };

    const handleToggleHide = async (car) => {
        try {
            const payload = { isHidden: !car.isHidden };
            const response = await fetch(`${API_URL}/featured-cars/${car._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                await logAdminAction(car.isHidden ? 'Unhid Garage Car' : 'Hid Garage Car', `Car: ${car.carName} | Owner: ${car.builtBy}`);
                // Remove from view immediately, or update it if we weren't filtering them exactly, but since we are on separate pages, hiding removes it from current view:
                setCars(cars.filter(c => c._id !== car._id));
            }
        } catch (error) {
            console.error("Error toggling hide status:", error);
        }
    };

    const handleUnhideAll = async () => {
        if (!window.confirm("Are you sure you want to unhide all cards?")) return;
        try {
            const response = await fetch(`${API_URL}/featured-cars/unhide-all`, { method: 'PUT' });
            if (response.ok) {
                await logAdminAction('Unhid All Garage Cars', 'Admin clicked unhide all cards in hidden garage mode');
                setCars([]); // since we unhid all, there are no hidden cars anymore
            }
        } catch (error) {
            console.error("Error unhiding all:", error);
        }
    };

    const filteredCars = cars.filter((car) => {
    const query = searchOwner.toLowerCase();

    return (
        car.builtBy.toLowerCase().includes(query) ||
        car.carName.toLowerCase().includes(query)
    );
});

const selectedIndex = selectedCar
    ? filteredCars.findIndex((car) => car._id === selectedCar._id)
    : -1;

const previousCar =
    selectedIndex > 0
        ? filteredCars[selectedIndex - 1]
        : null;

const nextCar =
    selectedIndex < filteredCars.length - 1
        ? filteredCars[selectedIndex + 1]
        : null;

useEffect(() => {
    if (!selectedCar) return;

    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            setSelectedCar(null);
        }

        if (e.key === "ArrowLeft" && previousCar) {
            setSelectedCar(previousCar);
        }

        if (e.key === "ArrowRight" && nextCar) {
            setSelectedCar(nextCar);
        }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);

}, [selectedCar, previousCar, nextCar]);

    return (
        <main className="pt-32 pb-32 bg-deep-black min-h-screen relative overflow-hidden">

            {/* Creative Backgrounds */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-electric-blue/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neon-purple/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full">

{/* ================= HERO ================= */}

<section className="relative overflow-hidden text-center py-20 md:py-28">

    {/* Huge Background Text */}

    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">

        <h1 className="
            text-[7rem]
            md:text-[13rem]
            lg:text-[16rem]
            font-black
            font-heading
            uppercase
            tracking-[0.25em]
            text-white/[0.025]
        ">
            TRS
        </h1>

    </div>

    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-5xl mx-auto"
    >

        <span className="
            inline-flex
            items-center
            rounded-full
            border
            border-electric-blue/30
            bg-electric-blue/10
            text-electric-blue
            px-5
            py-2
            uppercase
            tracking-[0.3em]
            text-[11px]
            hover:font-bold
            hover:tracking-[0.4em]
            hover:bg-electric-blue/60
            hover:text-white
            hover:border-white
            transition-all
            duration-500

        ">
            THE ROYAL SORCERERS • VEHICLE ARCHIVE
        </span>

        <h1 className="
        block
            mt-8
            text-5xl
            md:text-7xl
            lg:text-8xl
            font-black
            font-heading
            uppercase
            leading-none

            text-transparent
            bg-clip-text
            bg-gradient-to-r
            from-electric-blue
            via-white
            to-neon-purple
        ">

            THE GARAGE


        </h1>

        <p className="
            mt-8
            max-w-3xl
            mx-auto
            text-white/60
            text-base
            md:text-lg
            leading-8
            hover:text-white
            transition-all
            duration-500
        ">

            Every featured build represents countless hours of creativity,
            craftsmanship and personality. This archive preserves the vehicles
            that have helped define the legacy of The Royal Sorcerers.

        </p>

    </motion.div>

</section>

{/* ================= FEATURED BUILD ================= */}
{/*
{cars.length > 0 && (

<motion.section
    initial={{ opacity:0, y:30 }}
    whileInView={{ opacity:1, y:0 }}
    viewport={{ once:true }}
    transition={{ duration:.6 }}
    className="mb-16"
>

<div className="relative overflow-hidden rounded-3xl border border-white/10">

    <img
        src={cars[0].image}
        alt={cars[0].carName}
        className="w-full h-[500px] object-cover"
    />

    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"/>

    <div className="absolute left-12 bottom-12 max-w-xl">

        <p className="uppercase tracking-[0.35em] text-electric-blue text-xs">

            Featured Build of the Week

        </p>

        <h2 className="mt-5 text-6xl font-heading font-black">

            {cars[0].carName}

        </h2>

        <p className="mt-3 text-white/70">

            Built by {cars[0].builtBy}

        </p>

    </div>

</div>

</motion.section>

)}

*/}

{/* ================= DASHBOARD ================= */}

<div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-12">

    {/* Vehicles */}

<motion.div
    whileHover={{ y: -5, scale: 1.03 }}
    className="group glass-panel relative overflow-hidden p-6"
>

<div className="absolute top-0 left-0 w-full h-[2px] bg-electric-blue/80"></div>
        <div className="absolute top-0 left-0 w-full h-full -translate-y-full group-hover:-translate-y-0 -z-20 bg-electric-blue/80"></div>

        <p className="text-[11px] uppercase tracking-[0.25em] text-white/40 group-hover:text-white z-10 transition-all duration-500">
            Vehicles Stored
        </p>

        <h2 className="mt-3 text-4xl font-black text-electric-blue font-heading group-hover:text-white z-10 transition-all duration-500">
            {cars.length}
        </h2>

    </motion.div>

    {/* Builders */}

<motion.div
    whileHover={{ y: -5, scale: 1.03 }}
    className="group glass-panel relative overflow-hidden p-6"
>

        <div className="absolute top-0 left-0 w-full h-[2px] bg-neon-purple/80"></div>
        <div className="absolute top-0 left-0 w-full h-full -translate-y-full group-hover:-translate-y-0 -z-20 bg-neon-purple/80"></div>

        <p className="text-[11px] uppercase tracking-[0.25em] text-white/40 group-hover:text-white z-10 transition-all duration-500">
            Builders
        </p>

        <h2 className="mt-3 text-4xl font-black text-neon-purple font-heading group-hover:text-white z-10 transition-all duration-500">
            {new Set(cars.map(car => car.builtBy)).size}
        </h2>

    </motion.div>

    {/* Collection */}

<motion.div
    whileHover={{ y: -5, scale: 1.03 }}
    className="group glass-panel relative overflow-hidden p-6"
>

        <div className="absolute top-0 left-0 w-full h-[2px] bg-oracle-gold/80"></div>
        <div className="absolute top-0 left-0 w-full h-full -translate-y-full group-hover:-translate-y-0 -z-20 bg-oracle-gold/80"></div>

        <p className="text-[11px] uppercase tracking-[0.25em] text-white/40 group-hover:text-white z-10 transition-all duration-500">
            Collection
        </p>

        <h2 className="mt-3 text-4xl font-black text-oracle-gold font-heading group-hover:text-white z-10 transition-all duration-500">
            2024
        </h2>

    </motion.div>

    {/* Showing */}

<motion.div
    whileHover={{ y: -5, scale: 1.03 }}
    className="group glass-panel relative overflow-hidden p-6"
>

        <div className="absolute top-0 left-0 w-full h-[2px] bg-neon-green/80"></div>
        <div className="absolute top-0 left-0 w-full h-full -translate-y-full group-hover:-translate-y-0 -z-20 bg-neon-green/80"></div>

        <p className="text-[11px] uppercase tracking-[0.25em] text-white/40 group-hover:text-white z-10 transition-all duration-500">
            Showing
        </p>

        <h2 className="mt-3 text-4xl font-black text-neon-green font-heading group-hover:text-white z-10 transition-all duration-500">
            {Math.min(visibleCount, filteredCars.length)}
            <span className="text-white/30 group-hover:text-white/80 z-10 transition-all duration-500">/{filteredCars.length}</span>
        </h2>

    </motion.div>

</div>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col md:flex-row justify-center mb-10 -mt-6 relative z-10"
                >
<div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">

    <div
        className={`bg-[#0a0a0a] border border-white/10 hover:border-neon-purple/50 rounded-xl p-4 flex items-center gap-4 group shadow-lg w-full md:w-[520px] ${isArrangeMode ? 'opacity-50' : ''}`}
    >

        <Search
            size={20}
            className="text-electric-blue drop-shadow-[0_0_8px_rgba(0,229,255,0.6)] group-hover:text-neon-purple transition-all duration-500"
        />

        <input
            type="text"
            placeholder="Search vehicles or builders..."
            value={searchOwner}
            onChange={(e) => setSearchOwner(e.target.value)}
            disabled={isArrangeMode}
            className="w-full bg-transparent border-none text-white focus:outline-none placeholder:text-white/30"
        />

    </div>

</div>
                </motion.div>

                {/* ================= CONTROL CENTER ================= */}

<div className="glass-panel relative overflow-hidden rounded-2xl p-8 mb-14">

    {/* Top Accent */}

    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-electric-blue via-neon-purple to-electric-blue"></div>

    <div className="text-center">

        <p className="
            uppercase
            tracking-[0.35em]
            text-[11px]
            text-electric-blue
            font-bold
        ">
            Garage Control Center
        </p>

        <h3 className="
            mt-3
            text-3xl
            md:text-4xl
            font-heading
            font-black
        ">
            Vehicle Management
        </h3>

        <p className="
            mt-3
            text-white/50
            max-w-2xl
            mx-auto
            leading-relaxed
            hover:text-white
            transition-all
            duration-500
        ">
            Manage featured builds, organize the collection,
            access hidden vehicles and navigate to the Hall of Fame.
        </p>

    </div>

    <div className="mt-8 flex flex-wrap justify-center gap-4">

                        {isHiddenMode && canHideGarageCars && (
                            <button
                                onClick={handleUnhideAll}
                                className="
group
relative

px-7
py-3.5

rounded-xl

bg-black/40

backdrop-blur-xl

hover:border-electric-blue/40

hover:bg-electric-blue/10

transition-all

duration-300

uppercase

tracking-[0.2em]

text-xs

font-bold

overflow-hidden
"
                            >
                                <RefreshCw size={18} />
                                Unhide All
                            </button>
                        )}
                        {!isHiddenMode && canHideGarageCars && (
                            <Link
                                to="/garage/hidden"
                                className="
group
relative

px-7
py-3.5

rounded-xl

bg-black/40

backdrop-blur-xl

hover:bg-electric-blue/50

hover:text-white

text-electric-blue

transition-all

duration-300

uppercase

tracking-[0.2em]

text-xs

font-bold

overflow-hidden
"
                            >
                                <EyeOff size={18} />
                                Hidden Cars
                            </Link>
                        )}
                        {isSuperAdmin && !isHiddenMode && (
                            <button
                                onClick={handleShuffle}
                                disabled={isSavingOrder}
                                className="
group
relative

px-7
py-3.5

rounded-xl

bg-black/40

backdrop-blur-xl

hover:bg-electric-blue/50

hover:text-white

text-electric-blue

transition-all

duration-300

uppercase

tracking-[0.2em]

text-xs

font-bold

overflow-hidden
"
                            >
                                <Shuffle size={18} />
                                {isSavingOrder ? 'Wait...' : 'Shuffle'}
                            </button>
                        )}
                        {isAdmin && !isHiddenMode && (
                            <button
                                onClick={() => setIsFormOpen(!isFormOpen)}
                                className="
group
relative

px-7
py-3.5

rounded-xl

bg-black/40

backdrop-blur-xl

hover:bg-electric-blue/50

transition-all

duration-300

uppercase

tracking-[0.2em]

text-xs

font-bold

overflow-hidden

from-electric-blue
to-neon-purple

text-electric-blue

hover:scale-[1.03]
hover:text-white"
                            >
                                {isFormOpen ? <X size={18} /> : <Plus size={18} />}
                                {isFormOpen ? 'Cancel' : 'Add Build'}
                            </button>
                        )}
                        {!isHiddenMode ? (
                            <Link to="/showroom" className="
group
relative

px-7
py-3.5

rounded-xl


bg-black/40

backdrop-blur-xl

hover:text-white

hover:bg-electric-blue/50

text-electric-blue


transition-all

duration-300

uppercase

tracking-[0.2em]

text-xs

font-bold

overflow-hidden
">
                                <ArrowRight size={18} />
                                
                                Visit Hall of Fame
                            </Link>
                        ) : (
                            <Link to="/garage" className="
group
relative

px-7
py-3.5

rounded-xl

border
border-white/10

bg-black/40

backdrop-blur-xl

hover:border-electric-blue/40

hover:bg-electric-blue/10

transition-all

duration-300

uppercase

tracking-[0.2em]

text-xs

font-bold

overflow-hidden
">
                                Back to Garage <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                            </Link>
                        )}

    </div>

</div>

                {/* Form Animation */}
                <AnimatePresence>
                    {isAdmin && isFormOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-12"
                        >
                            <div className="glass-panel p-8 rounded-xl border-t border-electric-blue/30 bg-black/40 backdrop-blur-xl relative shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                                <h3 className="text-2xl font-bold mb-6 font-heading text-white flex items-center gap-3">
                                    {editingId ? 'Edit Garage Build' : 'Feature New Build'}
                                </h3>
                                <form onSubmit={handleAddOrUpdateCar} className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-white/50 pl-1">Car Name</label>
                                            <input required type="text" placeholder="e.g. Annis Remus" value={carName} onChange={e => setCarName(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-md px-4 py-3.5 text-sm text-white focus:outline-none focus:border-electric-blue transition-colors" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-white/50 pl-1">Built By</label>
                                            <input required type="text" placeholder="Owner / Tuner Name" value={builtBy} onChange={e => setBuiltBy(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-md px-4 py-3.5 text-sm text-white focus:outline-none focus:border-electric-blue transition-colors" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-white/50 pl-1">Image URL (Optional)</label>
                                        <input type="url" placeholder="Leave empty for a random car image..." value={image} onChange={e => setImage(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-md px-4 py-3.5 text-sm text-white focus:outline-none focus:border-electric-blue transition-colors" />
                                    </div>

                                    <button disabled={isSubmitting} type="submit" className="w-full py-4 mt-6 bg-gradient-to-r from-electric-blue to-neon-purple hover:from-electric-blue/80 hover:to-neon-purple/80 text-white text-sm font-bold uppercase tracking-widest rounded-md transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)]">
                                        {isSubmitting ? 'Saving...' : (editingId ? 'Update Build' : 'Deploy to Garage')}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {loading ? (
                    <div className="flex justify-center items-center py-32">
                        <div className="w-12 h-12 border-4 border-white/10 border-t-electric-blue rounded-full animate-spin"></div>
                    </div>
                ) : filteredCars.length === 0 ? (
                    <div className="text-white/40 text-center py-32 tracking-widest uppercase font-bold text-xl border border-dashed border-white/10 rounded-xl bg-white/5">
                        {searchOwner ? 'No TRS builds found under that owner.' : 'Garage is currently empty.'}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
                            <AnimatePresence>
                                {filteredCars.slice(0, visibleCount).map((car, i) => (
                                    <motion.div
    key={car._id}
    onClick={() => setSelectedCar(car)}
                                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                        transition={{
    duration: 0.55,
    delay: i * 0.08, ease: "easeOut" }}
                                        className="group relative cursor-pointer"
                                    >
                                        <div className="relative

aspect-[16/11]

rounded-3xl

overflow-hidden

border

border-white/10

bg-[#070707]

shadow-[0_15px_40px_rgba(0,0,0,.5)]

hover:border-electric-blue/30

hover:-translate-y-3

hover:shadow-[0_25px_60px_rgba(0,229,255,.12)]

transition-all

duration-500">
                                            <LazyImage
                                            
                                                src={car.image}
                                                variant="detail" // good quality for these large hero-style cards
                                                alt={car.carName}
                                                className="
transition-all
duration-700
saturate-90
brightness-75
group-hover:scale-110
group-hover:saturate-150
group-hover:brightness-115
"
                                            />

                                            <div
    className="
        absolute
        -bottom-32
        left-1/2
        -translate-x-1/2

        w-72
        h-40

        rounded-full

        bg-electric-blue/20

        blur-[100px]

        opacity-0

        group-hover:opacity-100

        transition-all

        duration-700

        pointer-events-none
    "
/>

                                            <div
    className="
        absolute
        inset-y-0
        -left-1/2
        w-1/3
        rotate-12
        bg-gradient-to-r
        from-transparent
        via-white/20
        to-transparent
        blur-xl
        opacity-0
        group-hover:opacity-100
        group-hover:left-[130%]
        transition-all
        duration-1000
        pointer-events-none
    "
/>

                                            {/* Subtle Gradient Overlays */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-black/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
                                            <div className="absolute inset-0 bg-gradient-to-tr from-electric-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

{/* ================= ACTION TOOLBAR ================= */}

<div className="absolute top-5 right-5 z-30 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-[-10px] group-hover:translate-y-0">

    {/* Move Left */}
    {canArrangeGarage && !isHiddenMode && (
        <button
            onClick={(e) => {
                e.stopPropagation();
                handleMove(car._id, "left");
            }}
            disabled={i === 0}
            className="p-3 bg-electric-blue/15 hover:bg-electric-blue text-electric-blue hover:text-white rounded-lg backdrop-blur-md transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move Forward"
        >
            <MoveLeft size={16} />
        </button>
    )}

    {/* Move Right */}
    {canArrangeGarage && !isHiddenMode && (
        <button
            onClick={(e) => {
                e.stopPropagation();
                handleMove(car._id, "right");
            }}
            disabled={i === filteredCars.length - 1}
            className="p-3 bg-electric-blue/15 hover:bg-electric-blue text-electric-blue hover:text-white rounded-lg backdrop-blur-md transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move Backward"
        >
            <MoveRight size={16} />
        </button>
    )}

    {/* Hide / Unhide */}
    {isAdmin && canHideGarageCars && (
        <button
            onClick={(e) => {
                e.stopPropagation();
                handleToggleHide(car);
            }}
            className="p-3 bg-neon-purple/15 hover:bg-neon-purple text-neon-purple hover:text-white rounded-lg backdrop-blur-md transition-all"
            title={car.isHidden ? "Unhide Car" : "Hide Car"}
        >
            {car.isHidden ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
    )}

    {/* Edit */}
    {isAdmin && (
        <button
            onClick={(e) => {
                e.stopPropagation();
                handleEdit(car);
            }}
            className="p-3 bg-oracle-gold/15 hover:bg-oracle-gold text-oracle-gold hover:text-white rounded-lg backdrop-blur-md transition-all"
            title="Edit"
        >
            <Edit2 size={16} />
        </button>
    )}

    {/* Delete */}
    {isAdmin && (
        <button
            onClick={(e) => {
                e.stopPropagation();
                handleDelete(car._id);
            }}
            className="p-3 bg-neon-red/15 hover:bg-neon-red text-neon-red hover:text-white rounded-lg backdrop-blur-md transition-all"
            title="Delete"
        >
            <Trash2 size={16} />
        </button>
    )}

</div>

                                            {/* Garage Slot */}

<div className="absolute top-5 left-5 z-20 group">

    <div className="
        rounded-xl
        border
        border-white/10
        bg-black/15
        backdrop-blur-xl
        px-4
        py-2
    ">

        <p className="text-[9px] uppercase tracking-[0.3em] text-white/40 group-hover:text-white transition-all duration-500">
            Garage Slot
        </p>

        <p className="text-lg font-black text-electric-blue/40 font-heading group-hover:text-electric-blue transition-all duration-500">
            #{String(i + 1).padStart(3, "0")}
        </p>

    </div>

</div>

                                            {/* Content */}
                                            <div className="absolute bottom-0 left-0 w-full z-20 p-7">

    <p className="text-[10px] uppercase tracking-[0.3em] text-electric-blue font-bold">
        {car.builtBy}
    </p>

    <h2 className="
        mt-2
        text-3xl
        md:text-4xl
        font-heading
        font-black
        leading-none
        transition-all
        duration-300
        group-hover:text-electric-blue
    ">
        {car.carName}
    </h2>

    <div className="mt-6 flex items-center justify-between">

        <div className="h-px flex-1 bg-white/10"></div>

        <span className="
            mx-4
            text-[10px]
            uppercase
            tracking-[0.3em]
            text-white/35
        ">
            Featured Build
        </span>

        <div className="h-px flex-1 bg-white/10"></div>

    </div>

</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                        {visibleCount < filteredCars.length && (
                            <div className="mt-12 flex justify-center">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const currentScrollY = window.scrollY;
                                        setVisibleCount(prev => prev + 12);
                                        setTimeout(() => {
                                            window.scrollTo({
                                                top: currentScrollY,
                                                behavior: "instant"
                                            });
                                        }, 5);
                                    }}
                        
                                    className="px-8 py-4 border border-electric-blue/20 hover:border-electric-blue/50 hover:text-white  transition-all duration-500 uppercase tracking-widest text-sm font-bold rounded-sm text-electric-blue hover:bg-electric-blue/50"
                                >
                                    Reveal More Vehicles
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <AnimatePresence>

{selectedCar && (

<motion.div
    initial={{ opacity:0 }}
    animate={{ opacity:1 }}
    exit={{ opacity:0 }}
    className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-2xl flex items-center justify-center p-8"
    onClick={() => setSelectedCar(null)}
>

<motion.div
    initial={{
    opacity:0,
    scale:.95,
    y:40
}}

animate={{
    opacity:1,
    scale:1,
    y:0
}}

exit={{
    opacity:0,
    scale:.98,
    y:30
}}
    transition={{ duration:.35 }}
    onClick={(e)=>e.stopPropagation()}
    className="max-w-6xl w-full"
>

<button
    onClick={()=>setSelectedCar(null)}
    className="absolute top-8 right-8 text-white/60 hover:text-white text-3xl"
>
×
</button>

<div className="mt-8">

<p className="uppercase tracking-[0.35em] text-electric-blue text-xs">

{selectedCar.builtBy}

</p>

<h1 className="mt-3 text-6xl font-heading font-black">

{selectedCar.carName}

</h1>

</div>

<div className="mt-10 rounded-3xl overflow-hidden border border-white/10">
<img
    src={selectedCar.image}
    alt={selectedCar.carName}
    className="
w-full
max-h-[75vh]
object-cover
transition-transform
duration-700
hover:scale-[1.02]
"
/>
</div>

<div className="mt-8 flex justify-between items-center">

    <button
        disabled={!previousCar}
        onClick={() => previousCar && setSelectedCar(previousCar)}
        className="px-6 py-3 rounded-xl border border-white/10 hover:border-electric-blue disabled:opacity-20 transition-all"
    >
        ← Previous
    </button>

<button
    onClick={() => setSelectedCar(null)}
    className="
    absolute
    top-8
    right-8

    w-12
    h-12

    rounded-full

    bg-black/50

    border

    border-white/10

    backdrop-blur-xl

    hover:border-electric-blue

    transition-all
    "
>

<X size={20} />

</button>

    <button
        disabled={!nextCar}
        onClick={() => nextCar && setSelectedCar(nextCar)}
        className="flex-1

max-w-[180px]

py-4

rounded-xl

border

border-white/10

hover:border-electric-blue

transition-all"
    >
        Next →
    </button>

</div>

</motion.div>

</motion.div>

)}

</AnimatePresence>
        </main>
    );
};

export default Garage;