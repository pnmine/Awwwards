import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React from "react";
import { ScrollTrigger } from "gsap/all";
import AnimatedTitle from "./AnimatedTitle";
gsap.registerPlugin(ScrollTrigger);

const About = () => {
	useGSAP(
		() => {
			const clipAnimation = gsap.timeline({
				scrollTrigger: {
					trigger: "#clip", //trigger the animation when the element is in view
					start: "center center",
					end: "+=800 center", //เริ่มที่ center จบที่ 800px จาก center
					scrub: 0.5, //smooth scrubbing effect คือการเลื่อนอย่างนุ่มนวล
					pin: true, //ตรึง element นี้ไว้ตลอดการเลื่อน
					pinSpacing: true, //ให้ element ที่ตรึงไว้มีช่องว่าง
				},
			});

			// ให้ element ที่มี class .mask-clip-path ทำ animation โดยเปลี่ยนค่า width, height, borderRadius เมื่อ scroll
			clipAnimation.to(".mask-clip-path", {
				width: "100vw",
				height: "100vh",
				borderRadius: 0,
			});
		},
		{ dependencies: [] }
	);

	return (
		<div id="about" className="min-h-screen w-screen">
			<div className="about__container">
				<h2 className="font-general font-bold text-sm uppercase md:text-[10px]">
					Welcome to Zentry
				</h2>

				<AnimatedTitle
					title="Disc<b>o</b>ver the world's <br /> largest shared <b>a</b>dventure"
          containerClass="mt-5 !text-black text-center"
				/>

				<div className="about__subtext">
					<p className="text-black">
						The Metagame begins—your life, now an epic MMORPG
					</p>
					<p>
						Zentry is the unified play layer that bridges players, agentic AI,
						and blockchains, creating a new economic paradigm.
					</p>
				</div>
			</div>

			<div className="h-dvh w-scree " id="clip">
				<div className=" mask-clip-path about__image">
					<img
						src="./img/about.webp"
						alt="Background"
						className="absolute left-0 top-0 size-full object-cover"
					/>
				</div>
			</div>
		</div>
	);
};

export default About;
