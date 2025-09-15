import svgPaths from "./svg-wh69x1kzst";
import imgUber0213C7Cd81E2 from "figma:asset/0c4e8a4be75e7d129875490702ea90e0ae00c34d.png";
import imgImage from "figma:asset/176ba6c12ab7f022834992fb78872f1e9feeb9a4.png";

function Frame1410081214() {
  return (
    <div className="absolute h-[30.776px] left-[588px] top-[109.04px] w-[58px]">
      <div className="absolute bg-[#505050] h-[4.735px] left-0 rounded-[20.122px] top-0 w-[58px]" />
      <div className="absolute bg-[#505050] h-[4.735px] left-[11.84px] rounded-[20.122px] top-[13.02px] w-[46.163px]" />
      <div className="absolute bg-[#505050] h-[4.735px] left-[11.84px] rounded-[20.122px] top-[26.04px] w-[46.163px]" />
    </div>
  );
}

function YourPickupPointDestination() {
  return (
    <div className="absolute bg-[#ffffff] box-border content-stretch flex gap-2.5 h-[199px] items-end justify-start left-0 px-[50px] py-[42px] right-0 rounded-[25px] translate-y-[-50%]" data-name="Your Pickup Point & Destination" style={{ top: "calc(50% - 655.5px)" }}>
      <div className="absolute font-['K2D:Medium',_sans-serif] leading-[0] left-[50px] not-italic text-[#2a2a2a] text-[55.348px] text-nowrap top-[88px]">
        <p className="leading-[normal] whitespace-pre">Rescue</p>
      </div>
      <Frame1410081214 />
    </div>
  );
}

function AutoLayoutHorizontal() {
  return (
    <div className="h-[20.924px] relative shrink-0 w-[122.054px]" data-name="Auto Layout Horizontal">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 123 21">
        <g id="Auto Layout Horizontal">
          <path d={svgPaths.p32edff00} fill="var(--fill-0, #170E2B)" id="Exclude" />
          <path d={svgPaths.p2a5c5700} fill="var(--fill-0, #170E2B)" id="Exclude_2" />
          <g id="Group">
            <path d={svgPaths.p2de66400} fill="var(--fill-0, #170E2B)" id="Union" opacity="0.4" />
            <rect fill="var(--fill-0, #170E2B)" height="13.5385" id="Rectangle" rx="2.32479" width="30.9614" x="83.6469" y="3.69172" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function AutoLayoutHorizontal1() {
  return (
    <div className="absolute bg-[#ffffff] box-border content-stretch flex gap-[469.026px] h-[58px] items-center justify-center left-0 overflow-clip px-0 py-[6.974px] top-0 w-[699px]" data-name="Auto Layout Horizontal">
      <div className="font-['Roboto:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#170e2b] text-[24.41px] text-nowrap tracking-[0.0244px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre">12:30</p>
      </div>
      <AutoLayoutHorizontal />
    </div>
  );
}

export default function Frame1410081238() {
  return (
    <div className="relative size-full">
      <div className="absolute bg-center bg-cover bg-no-repeat h-[1510px] left-0 top-0 w-[703px]" data-name="Uber 02-13_c7cd81e2" style={{ backgroundImage: `url('${imgUber0213C7Cd81E2}')` }} />
      <div className="absolute bg-[51.58%_88.91%] bg-no-repeat bg-size-[254.52%_212.11%] bottom-[59.54%] left-0 right-[-0.43%] top-0" data-name="image" style={{ backgroundImage: `url('${imgImage}')` }} />
      <YourPickupPointDestination />
      <AutoLayoutHorizontal1 />
      <div className="absolute bg-[#0f1d1a] h-[51.836px] rounded-[34.257px] top-[33.35px] translate-x-[-50%] w-[268.645px]" style={{ left: "calc(50% + 0.322px)" }} />
    </div>
  );
}