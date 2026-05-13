import AnimatedBackground from "@components/AnimatedBackground";

const Home = () => {
    return (

        <main className="relative min-h-screen bg-black overflow-hidden">
            <AnimatedBackground />

            <div className="relative z-10 flex min-h-screen items-center justify-center">
                <h1 className="font-unbounded text-4xl font-bold mb-4">Welcome to Enso</h1> 
            </div>
        </main>
    );
}

export default Home