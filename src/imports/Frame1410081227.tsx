import svgPaths from "./svg-4olgt74d78";

function Frame1410081236() {
  return (
    <div className="relative shrink-0 size-[81.825px]">
      <div className="absolute inset-[-11.36%_-22.73%_-34.09%_-22.73%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 120 120">
          <g id="Frame 1410081236">
            <g filter="url(#filter0_d_9_230)" id="Group">
              <path d={svgPaths.p25f4b440} fill="var(--fill-0, white)" id="Rectangle" />
            </g>
            <path d={svgPaths.pae95500} fill="var(--fill-0, black)" id="icon_back" />
            <path d={svgPaths.p1cf54280} fill="var(--fill-0, black)" id="icon_back_2" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="119.019" id="filter0_d_9_230" width="119.019" x="0.403309" y="0.701654">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="9.29835" />
              <feGaussianBlur stdDeviation="9.29835" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.102 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_9_230" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_9_230" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Frame1410081237() {
  return (
    <div className="absolute content-stretch flex gap-[106px] items-center justify-start left-[50px] top-[59px] w-[576px]">
      <Frame1410081236 />
      <div className="font-['Poppins:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[29.755px] text-nowrap">
        <p className="leading-[normal] whitespace-pre">Slide to pay now!</p>
      </div>
    </div>
  );
}

function Group64() {
  return (
    <div className="absolute contents left-[50px] top-[59px]">
      <Frame1410081237 />
    </div>
  );
}

function Button() {
  return (
    <div className="absolute contents inset-[20%_5.74%_20.5%_4.3%]" data-name="Button">
      <div className="absolute inset-[20%_5.74%_20.5%_4.3%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 627 119">
          <path d={svgPaths.p1aa9d80} fill="var(--fill-0, black)" id="Rectangle 17" />
        </svg>
      </div>
      <Group64 />
    </div>
  );
}

export default function Frame1410081227() {
  return (
    <div className="bg-[#ffffff] relative shadow-[0px_7px_35.3px_0px_rgba(0,0,0,0.15)] size-full">
      <Button />
    </div>
  );
}