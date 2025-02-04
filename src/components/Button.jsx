import React from "react";

const Button = ({ id, title, rightIcon, leftIcon, containerClass }) => {
	return (
		<button
			id={id}
			className={`group z-10 px-7 py-3 w-fit bg-violet-50 font-bold
       text-black rounded-full relative flex justify-center items-center
       cursor-pointer overflow-hidden ${containerClass}`}
		>
			{leftIcon}
			<span className="relative inline-flex overflow-hidden text-sm uppercase sm:text-back ">
				<div>{title}</div>
			</span>
      {rightIcon}
		</button>
	);
};

export default Button;
