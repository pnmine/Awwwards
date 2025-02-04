import React, { useRef, useState, useEffect } from "react";
import Button from "./Button";
import { TiLocationArrow } from "react-icons/ti";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
	const [currentIndex, setCurrentIndex] = useState(1);
	const [hasClicked, setHasClicked] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [loadedVideos, setLoadedVideos] = useState(0);

	const totalVideos = 4;
	const nextVideoRef = useRef(null);

	const handleVideoLoad = () => {
		setLoadedVideos((prev) => prev + 1);
	};

	useEffect(() => {
		if (loadedVideos === totalVideos ) {
			setIsLoading(false);
		}
	}, [loadedVideos]);

	const upcomingVideoIndex = (currentIndex % totalVideos) + 1;
	const handleMiniVideoClick = () => {
		setHasClicked(true);
		// 0%4 = 0 + 1 => 1
		// 1%4 = 1 +1 => 2 ..
		// ..
		// 4%4 = 0 +1 => 1
		setCurrentIndex(upcomingVideoIndex);
	};

	const getVideoSource = (index) => `./videos/hero-${index}.mp4`;

	//mini player animate
	useGSAP(
		() => {
			if (hasClicked) {
				gsap.set("#next-video", { visibility: "visible" });
				gsap.to("#next-video", {
					// ขยายเต็มขนาดภายใน 1 วินาที และเล่นวิดีโอเมื่อเริ่มแอนิเมชัน
					transformOrigin: "center center", //กำหนดจุดเริ่มต้นของการแปลง (transform) ให้อยู่ที่กึ่งกลางขององค์ประกอบ
					scale: 1, //ขนาดขององค์ประกอบจะถูกปรับเป็น 1 เท่า (ไม่มีการขยายหรือย่อ)
					width: "100%", // ความกว้างขององค์ประกอบจะถูกปรับเป็น 100%
					height: "100%",
					duration: 1, //ระยะเวลาของแอนิเมชันคือ 1 วินาที
					ease: "power1.inOut", // ใช้การเคลื่อนไหวแบบ power1.inOut เพื่อให้แอนิเมชันมีการเร่งและชะลอที่นุ่มนวล
					onStart: () => {
						nextVideoRef.current.playsInline = true;
						nextVideoRef.current.play();
					}, //เมื่อแอนิเมชันเริ่มต้น จะเรียกฟังก์ชันเพื่อเล่นวิดีโอที่อ้างอิงโดย nextVideoRef.current
				});
				gsap.from("#current-video", {
					transformOrigin: "center center",
					scale: 0, //ขยายจากขนาด 0 -> ปกติ ภายใน 1.5 วินาที
					duration: 1.5,
					ease: "power1.inOut",
				});
			}
		},
		{ dependencies: [currentIndex], revertOnUpdate: true }
	);

	useGSAP(() => {
		gsap.set("#video-frame", {
			clipPath: " polygon(14% 0%, 72% 0%, 90% 90%, 0% 100%)",
			borderRadius: "0 0 40% 10%",
		});

		gsap.from("#video-frame", {
			clipPath: " polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
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
			scale: 1.2,
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
					<div className="absolute bottom-10 text-blue-900">Loading...{loadedVideos} / {totalVideos} </div>
				</div>
			)}

			<div id="video-frame" className="hero__video">
				<div className="hero__video--mask">
					<div
						onClick={handleMiniVideoClick}
						className="origin-center scale-50 opacity-0 
						transition-all duration-500 ease-in hover:scale-100 
						hover:opacity-100 max-sm:opacity-100 max-sm:scale-100 "
					>
						<video
							ref={nextVideoRef}
							src={getVideoSource(upcomingVideoIndex)}
							loop
							muted
							id="current-video"
							className=" size-64 origin-center scale-150 object-cover pointer-events-none"
							preload="auto"
							playsInline
							
						></video>
					</div>
				</div>
				<video
					ref={nextVideoRef}
					src={getVideoSource(currentIndex)}
					loop
					muted
					id="next-video"
					className="absolute-center z-20 size-64 object-cover invisible pointer-events-none"
					preload="auto"
					playsInline
				></video>
				<video
					src={getVideoSource(currentIndex)}
					autoPlay
					loop
					muted
					className="absolute left-0 top-0 size-full object-cover object-center pointer-events-none"
					onLoadedData={handleVideoLoad}
					preload="auto"
					playsInline
				></video>
				{/* Preload on IOS */}
				<video
					src={getVideoSource(currentIndex + 1)}
					autoPlay
					loop
					muted
					className="invisible"
					onLoadedData={handleVideoLoad}
					preload="auto"
					playsInline
				></video>
				<video
					src={getVideoSource(currentIndex + 2)}
					autoPlay
					loop
					muted
					className="invisible "
					onLoadedData={handleVideoLoad}
					preload="auto"
					playsInline
				></video>
				<video
					src={getVideoSource(currentIndex + 3)}
					autoPlay
					loop
					muted
					className="invisible "
					onLoadedData={handleVideoLoad}
					preload="auto"
					playsInline
				></video>

				<h1
					className="special-font hero-heading absolute bottom-5 
										right-5 z-40 text-blue-75 transition-all ease-in max-sm:px-5"
				>
					G<b>A</b>MING
				</h1>

				<div className="absolute left-0 top-0 z-40 size-full ">
					<div className="mt-24 px-5 sm:px-10 ">
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

			<h1
				className="special-font hero-heading absolute 
									bottom-5 right-5 text-black max-sm:px-5"
			>
				G<b>A</b>MING
			</h1>
		</div>
	);
};

export default Hero;
