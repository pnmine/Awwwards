import React, { useRef, useState, useEffect } from "react";
import Button from "./Button";
import { TiLocationArrow } from "react-icons/ti";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
	const [currentIndex, setCurrentIndex] = useState(1);
	const [isLoading, setIsLoading] = useState(true);
	const [loadedVideos, setLoadedVideos] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);
	const [currentVideoTime, setCurrentVideoTime] = useState(0);

	const totalVideos = 4;
	const miniVideoRef = useRef(null);
	const nextVideoRef = useRef(null);
	const backgroundVideoRef = useRef(null);

	const handleVideoLoad = () => {
		setLoadedVideos((prev) => prev + 1);
	};

	useEffect(() => {
		if (loadedVideos === totalVideos) {
			setIsLoading(false);
		}
	}, [loadedVideos]);

	const getVideoSource = (index) => {
		// Handle wrapping around to 1 when we exceed totalVideos
		const normalizedIndex = ((index - 1) % totalVideos) + 1;
		return `./videos/hero-${normalizedIndex}.mp4`;
	};

	const getUpcomingIndex = () => (currentIndex % totalVideos) + 1;

	const handleMiniVideoClick = () => {
		if (isAnimating) return;
		setIsAnimating(true);

		const upcomingIndex = getUpcomingIndex();

		// Prepare next video without cloning
		if (nextVideoRef.current) {
			nextVideoRef.current.src = getVideoSource(upcomingIndex);
			nextVideoRef.current.currentTime = 0;
			nextVideoRef.current.play();
		}

		gsap
			.timeline()
			.set(nextVideoRef.current, {
				visibility: "visible",
				scale: 0.5,
				width: "256px",
				height: "256px",
				opacity: 0,
			})
			.to(".hero__video--mask", {
				scale: 0.7,
				duration: 0.1,
				ease: "power2.inOut",
				onStart: () => {
					if (miniVideoRef.current) {
						miniVideoRef.current.src = getVideoSource(upcomingIndex + 1);
					}
				},
			})
			.to(
				nextVideoRef.current,
				{
					scale: 1,
					width: "100%",
					height: "100%",
					opacity: 1,
					duration: 0.8,
					ease: "power2.inOut",
				},
				"<"
			)
			.add(() => {
				// Sync background video with next video's current time
				if (backgroundVideoRef.current && nextVideoRef.current) {
					const syncTime = nextVideoRef.current.currentTime;
					backgroundVideoRef.current.src = getVideoSource(upcomingIndex);
					backgroundVideoRef.current.onloadedmetadata = () => {
						backgroundVideoRef.current.currentTime = syncTime;
						backgroundVideoRef.current.play().catch(() => {});
						backgroundVideoRef.current.onloadedmetadata = null;
					};
				}
			}, "-=0.3") // Sync slightly before next video fades out
			.to(nextVideoRef.current, {
				opacity: 0,
				duration: 0.3,
				ease: "power2.inOut",
				onComplete: () => {
					setCurrentIndex(upcomingIndex);
					setIsAnimating(false);

					if (nextVideoRef.current) {
						gsap.set(nextVideoRef.current, {
							visibility: "hidden",
							scale: 0.5,
							width: "256px",
							height: "256px",
						});
						nextVideoRef.current.src = getVideoSource(getUpcomingIndex());
					}
				},
			})
			.to(
				".hero__video--mask",
				{
					scale: 1,
					duration: 0.3,
					ease: "power2.out",
				},
				"-=0.3"
			);
	};

	useGSAP(() => {
		gsap.set("#video-frame", {
			clipPath: "polygon(14% 0%, 72% 0%, 90% 90%, 0% 100%)",
			borderRadius: "0 0 40% 10%",
		});

		gsap.from("#video-frame", {
			clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
			borderRadius: "0",
			ease: "power1.inOut",
			scrollTrigger: {
				trigger: "#video-frame",
				start: "center center",
				end: "bottom center",
				scrub: 0.75,
			},
		});
	});

	useEffect(() => {
		gsap.to(".hero__video--mask", {
			scale: 1.1,
			duration: 1,
			yoyo: true,
			repeat: -1,
			ease: "power1.inOut",
		});
	}, []);

	return (
		<div className="hero">
			{isLoading && (
				<div className="bg-violet-50 flex overflow-hidden h-dvh w-screen z-100 justify-center items-center absolute">
					<div className="three-body">
						<div className="three-body__dot"></div>
						<div className="three-body__dot"></div>
						<div className="three-body__dot"></div>
					</div>
					<div className="absolute bottom-10 text-blue-900">
						Loading...{loadedVideos} / {totalVideos}
					</div>
				</div>
			)}

			<div id="video-frame" className="hero__video">
				{/* Mini video preview */}
				<div className="hero__video--mask max-sm:size-30">
					<div
						onClick={handleMiniVideoClick}
						className="origin-center sm:scale-50 sm:opacity-0 
            transition-all duration-200 ease-in hover:scale-100 
            hover:opacity-100 opacity-100 scale-100"
					>
						<video
							ref={miniVideoRef}
							src={getVideoSource(getUpcomingIndex())}
							loop
							muted
							className="size-64 origin-center scale-150 object-cover pointer-events-none"
							preload="auto"
							playsInline
						></video>
					</div>
				</div>

				{/* Animating video - now showing the same video as mini preview */}
				<video
					ref={nextVideoRef}
					src={getVideoSource(getUpcomingIndex())}
					loop
					muted
					className="absolute-center z-20 size-64 object-cover invisible pointer-events-none"
					preload="auto"
					playsInline
				></video>

				{/* Background video */}
				<video
					ref={backgroundVideoRef}
					src={getVideoSource(currentIndex)}
					autoPlay
					loop
					muted
					className="absolute left-0 top-0 size-full object-cover object-center pointer-events-none"
					onLoadedData={handleVideoLoad}
					preload="auto"
					playsInline
				></video>

				{/* Preload videos */}
				{[1, 2, 3].map((offset) => (
					<video
						key={offset}
						src={getVideoSource(currentIndex + offset)}
						autoPlay
						loop
						muted
						className="invisible"
						onLoadedData={handleVideoLoad}
						preload="auto"
						playsInline
					/>
				))}

				{/* Rest of your UI elements */}
				<h1 className="special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75 transition-all ease-in max-sm:px-5">
					G<b>A</b>MING
				</h1>

				<div className="absolute left-0 top-0 z-40 size-full">
					<div className="mt-24 px-5 sm:px-10">
						<h1 className="special-font hero-heading text-blue-100">
							redefi<b>n</b>e
						</h1>
						<p className="mb-5 max-w-72 font-robert-regular text-blue-100 text-lg sm:text-1xl transition-all ease-in">
							Enter the Metagame <br /> Unleash the Play Economy
						</p>
						<Button
							id="watch-trailer"
							title="Watch Trailer"
							leftIcon={<TiLocationArrow />}
							containerClass="!bg-yellow-300 gap-1"
						/>
					</div>
				</div>
			</div>

			<h1 className="special-font hero-heading absolute bottom-5 right-5 text-black max-sm:px-5">
				G<b>A</b>MING
			</h1>
		</div>
	);
};

export default Hero;
