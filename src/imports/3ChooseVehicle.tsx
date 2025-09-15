import svgPaths from "./svg-u42y27j2nw";
import imgFrame from "figma:asset/4e95da5f9e6ec1d32f897fbff5c28b62b3c1d8ed.png";
import imgFrame1 from "figma:asset/516e77515feb8b0da14eb9d08100d04603ad8beb.png";
import imgFrame2 from "figma:asset/ccab72f0e9bf12b4ad08c152b84cbd87b9bb0945.png";
import imgFrame3 from "figma:asset/e22810488a2dea398cea28b8afe2e029a45b5b57.png";
import imgImage from "figma:asset/176ba6c12ab7f022834992fb78872f1e9feeb9a4.png";

function Maps() {
  return (
    <div className="absolute inset-0" data-name="Maps">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 698 1511">
        <g id="Maps">
          <g id="Maps_2"></g>
        </g>
      </svg>
    </div>
  );
}

function Ellipse5() {
  return (
    <div className="relative shrink-0 size-[29.755px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
        <g id="Ellipse 5">
          <path d={svgPaths.p600e630} fill="var(--fill-0, white)" id="Vector" />
          <path d={svgPaths.p30556c80} id="Vector_2" stroke="var(--stroke-0, #CF923D)" strokeWidth="7.43868" />
        </g>
      </svg>
    </div>
  );
}

function Frame1410081211() {
  return (
    <div className="content-stretch flex gap-5 items-center justify-start relative shrink-0">
      <Ellipse5 />
      <div className="font-['Poppins:Regular',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#656565] text-[26.035px] text-nowrap">
        <p className="leading-[normal] whitespace-pre">U Block, DLF Phase 3, Sector 24, Gur...</p>
      </div>
    </div>
  );
}

function IcPin() {
  return (
    <div className="h-[37px] relative shrink-0 w-7" data-name="ic_pin">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 37">
        <g id="ic_pin">
          <path d={svgPaths.p23784500} fill="var(--fill-0, black)" id="Oval" />
        </g>
      </svg>
    </div>
  );
}

function Frame1410081212() {
  return (
    <div className="content-stretch flex gap-[26px] items-center justify-start relative shrink-0">
      <IcPin />
      <div className="font-['Poppins:Regular',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#656565] text-[26.035px] text-nowrap">
        <p className="leading-[normal] whitespace-pre">Home</p>
      </div>
    </div>
  );
}

function Frame1410081213() {
  return (
    <div className="content-stretch flex flex-col gap-5 items-start justify-start relative shrink-0 w-[593px]">
      <Frame1410081211 />
      <div className="h-0 relative shrink-0 w-[593px]">
        <div className="absolute bottom-[-0.93px] left-0 right-0 top-[-0.93px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 593 2">
            <path d="M0 1H593" id="Line 1" stroke="var(--stroke-0, #EDEDED)" strokeWidth="1.85967" />
          </svg>
        </div>
      </div>
      <Frame1410081212 />
    </div>
  );
}

function Frame1410081214() {
  return (
    <div className="absolute h-[30.776px] left-[588px] top-[84px] w-[58px]">
      <div className="absolute bg-[#505050] h-[4.735px] left-0 rounded-[20.122px] top-0 w-[58px]" />
      <div className="absolute bg-[#505050] h-[4.735px] left-[11.84px] rounded-[20.122px] top-[13.02px] w-[46.163px]" />
      <div className="absolute bg-[#505050] h-[4.735px] left-[11.84px] rounded-[20.122px] top-[26.04px] w-[46.163px]" />
    </div>
  );
}

function YourPickupPointDestination() {
  return (
    <div className="absolute bg-[#ffffff] box-border content-stretch flex gap-2.5 h-[433px] items-end justify-start left-0 px-[50px] py-[42px] right-[0.2%] rounded-[25px] translate-y-[-50%]" data-name="Your Pickup Point & Destination" style={{ top: "calc(50% - 523.526px)" }}>
      <Frame1410081213 />
      <div className="absolute flex flex-col font-['Poppins:Medium',_sans-serif] justify-center leading-[0] left-[50px] not-italic text-[#000000] text-[36px] text-nowrap top-[202.5px] translate-y-[-50%]">
        <p className="leading-[68.063px] whitespace-pre">Find a trip</p>
      </div>
      <Frame1410081214 />
    </div>
  );
}

function Frame1410081215() {
  return (
    <div className="[grid-area:1_/_1] box-border content-stretch flex flex-col items-start justify-start ml-0 mt-0 not-italic relative">
      <div className="font-['Poppins:Medium',_sans-serif] min-w-full relative shrink-0 text-[#080a24] text-[36px]" style={{ width: "min-content" }}>
        <p className="leading-[normal]">Select Ride</p>
      </div>
      <div className="font-['Poppins:Regular',_sans-serif] relative shrink-0 text-[#656565] text-[18px] text-nowrap">
        <p className="leading-[normal] whitespace-pre">1st driver drops you 2nd driver delivers your car.</p>
      </div>
    </div>
  );
}

function Rectangle21() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative">
      <Frame1410081215 />
    </div>
  );
}

function Car1() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Car 1">
      <Rectangle21 />
    </div>
  );
}

function ChooseYourRide() {
  return (
    <div className="relative shrink-0 w-full" data-name="Choose your ride">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2.5 items-start justify-start px-[57px] py-0 relative w-full">
          <Car1 />
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return <div className="bg-[position:50%_50%,_53.92%_34.31%] bg-no-repeat bg-size-[cover,113.76%_121.18%] h-[92px] shrink-0 w-[98px]" data-name="Frame" style={{ backgroundImage: `url('${imgFrame}'), url('${imgFrame1}')` }} />;
}

function Frame1410081216() {
  return (
    <div className="content-stretch flex flex-col gap-[7px] items-start justify-start leading-[0] not-italic relative shrink-0 w-[170px]">
      <div className="font-['Poppins:Medium',_sans-serif] min-w-full relative shrink-0 text-[#000000] text-[28px]" style={{ width: "min-content" }}>
        <p className="leading-[normal]">Bike Rescue</p>
      </div>
      <div className="font-['Poppins:Regular',_sans-serif] relative shrink-0 text-[#656565] text-[18px] text-nowrap">
        <p className="leading-[normal] whitespace-pre">Pickup and drop you</p>
      </div>
    </div>
  );
}

function Frame1410081217() {
  return (
    <div className="content-stretch flex gap-5 items-center justify-start relative shrink-0">
      <Frame />
      <Frame1410081216 />
    </div>
  );
}

function Frame1410081218() {
  return (
    <div className="content-stretch flex flex-col font-['Poppins:Regular',_sans-serif] gap-1 items-start justify-start leading-[0] not-italic relative shrink-0 text-[#000000] w-[111px]">
      <div className="relative shrink-0 text-[30px] w-full">
        <p className="leading-[normal]">₹150.00</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[16px] w-full">
        <p className="leading-[normal]">2 mins away</p>
      </div>
    </div>
  );
}

function Frame1410081219() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-[610px]">
      <Frame1410081217 />
      <Frame1410081218 />
    </div>
  );
}

function Frame1410081220() {
  return (
    <div className="content-stretch flex flex-col gap-[19px] items-start justify-start relative shrink-0 w-full">
      <Frame1410081219 />
      <div className="h-0 relative shrink-0 w-[620px]">
        <div className="absolute bottom-[-0.5px] left-0 right-0 top-[-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 620 2">
            <path d="M0 1H620" id="Vector 37" stroke="var(--stroke-0, black)" strokeOpacity="0.12" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame1410081208() {
  return (
    <div className="bg-[#ec932d] box-border content-stretch flex flex-col gap-[8.4px] items-center justify-center px-[7.56px] py-0 relative rounded-[10.5px] shrink-0 size-[21px]">
      <div className="font-['Poppins:Regular',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[13.903px] text-nowrap">
        <p className="leading-[normal] whitespace-pre">i</p>
      </div>
    </div>
  );
}

function Frame1410081210() {
  return (
    <div className="bg-[#f1f1f1] box-border content-stretch flex gap-[13px] items-end justify-start pl-2.5 pr-[15px] py-[7px] relative rounded-[38px] shadow-[0px_2px_3px_0px_rgba(0,0,0,0.07)] shrink-0">
      <Frame1410081208 />
      <div className="flex flex-col font-['Poppins:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#424242] text-[16px] text-nowrap">
        <p className="leading-[20px] whitespace-pre">Experienced and Authorized Drivers</p>
      </div>
    </div>
  );
}

function Frame1410081224() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-[607px]">
      <div className="flex flex-col font-['Poppins:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#545454] text-[16px] text-nowrap">
        <p className="leading-[20px] whitespace-pre">Pickup by 15:23</p>
      </div>
      <Frame1410081210 />
    </div>
  );
}

function Frame1410081221() {
  return (
    <div className="content-stretch flex flex-col gap-[18px] items-center justify-start relative shrink-0 w-[627px]">
      <Frame1410081220 />
      <Frame1410081224 />
    </div>
  );
}

function Frame1410081544() {
  return (
    <div className="box-border content-stretch flex flex-col gap-2.5 items-start justify-start p-[20px] relative rounded-2xl shrink-0">
      <div aria-hidden="true" className="absolute border-2 border-[#505050] border-solid inset-0 pointer-events-none rounded-2xl" />
      <Frame1410081221 />
    </div>
  );
}

function Frame1410081203() {
  return (
    <div className="h-[37px] relative shrink-0 w-[76px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 76 37">
        <g id="Frame 1410081203">
          <rect fill="var(--fill-0, #CF923D)" height="37" id="Rectangle 4004" rx="18.5" width="76" />
          <circle cx="56.5" cy="18.5" fill="var(--fill-0, #FEFCFC)" id="Ellipse 294" r="14.5" />
        </g>
      </svg>
    </div>
  );
}

function Frame1410081204() {
  return (
    <div className="content-stretch flex gap-[23px] items-center justify-start relative shrink-0">
      <div className="font-['Poppins:Regular',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#292929] text-[16.552px] text-nowrap">
        <p className="leading-[normal] whitespace-pre">Don’t Need extra Drivers?</p>
      </div>
      <Frame1410081203 />
    </div>
  );
}

function Frame1410081205() {
  return (
    <div className="content-stretch flex flex-col gap-4 items-start justify-start relative shrink-0 w-[323px]">
      <div className="font-['Poppins:Medium',_sans-serif] leading-[0] min-w-full not-italic relative shrink-0 text-[#292929] text-[26.035px]" style={{ width: "min-content" }}>
        <p className="leading-[normal]">Select Number of Drivers</p>
      </div>
      <Frame1410081204 />
    </div>
  );
}

function Frame1410081201() {
  return (
    <div className="h-[45px] relative shrink-0 w-[54px]">
      <div className="absolute bg-[#e5d8c5] bottom-[-4.44%] left-0 right-0 rounded-lg top-[-4.44%]" />
      <div className="absolute bottom-0 font-['Poppins:Light',_sans-serif] leading-[0] left-[33.33%] not-italic right-[37.04%] text-[#000000] text-[29.755px] text-nowrap top-0">
        <p className="leading-[normal] whitespace-pre">-</p>
      </div>
    </div>
  );
}

function Frame1410081200() {
  return (
    <div className="h-[45px] relative shrink-0 w-[54px]">
      <div className="absolute bg-[#ffffff] bottom-[-4.44%] left-0 right-0 rounded-lg top-[-4.44%]">
        <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.61)] border-solid inset-0 pointer-events-none rounded-lg" />
      </div>
      <div className="absolute bottom-0 font-['Poppins:Regular',_sans-serif] leading-[0] left-[40.74%] not-italic right-[40.74%] text-[#292929] text-[29.755px] text-nowrap top-0">
        <p className="leading-[normal] whitespace-pre">1</p>
      </div>
    </div>
  );
}

function Frame1410081202() {
  return (
    <div className="h-[45px] relative shrink-0 w-[54px]">
      <div className="absolute bg-[#e5d8c5] bottom-[-4.44%] left-0 right-0 rounded-lg top-[-4.44%]" />
      <div className="absolute bottom-0 font-['Poppins:Light',_sans-serif] leading-[0] left-[33.33%] not-italic right-[29.63%] text-[#000000] text-[29.755px] text-nowrap top-0">
        <p className="leading-[normal] whitespace-pre">+</p>
      </div>
    </div>
  );
}

function Frame1410081209() {
  return (
    <div className="content-stretch flex gap-4 items-center justify-start relative shrink-0">
      <Frame1410081201 />
      <Frame1410081200 />
      <Frame1410081202 />
    </div>
  );
}

function Frame1410081206() {
  return (
    <div className="content-stretch flex gap-20 items-center justify-start relative shrink-0">
      <Frame1410081205 />
      <Frame1410081209 />
    </div>
  );
}

function Frame1410081545() {
  return (
    <div className="bg-[#f7efe4] box-border content-stretch flex flex-col gap-2.5 h-[162px] items-center justify-start px-[34px] py-7 relative rounded-[13px] shrink-0 w-[667px]">
      <Frame1410081206 />
    </div>
  );
}

function Frame1410081222() {
  return (
    <div className="bg-[#fefcfc] relative shrink-0 w-full">
      <div className="flex flex-col items-center justify-center relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2.5 items-center justify-center pb-[25px] pt-[19px] px-[33px] relative w-full">
          <Frame1410081544 />
          <Frame1410081545 />
        </div>
      </div>
    </div>
  );
}

function Frame1410081223() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-full">
      <Frame1410081222 />
    </div>
  );
}

function Frame1410081226() {
  return (
    <div className="h-[37px] relative shrink-0 w-[76px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 76 37">
        <g id="Frame 1410081203">
          <rect fill="var(--fill-0, #CF923D)" height="37" id="Rectangle 4004" rx="18.5" width="76" />
          <circle cx="56.5" cy="18.5" fill="var(--fill-0, #FEFCFC)" id="Ellipse 294" r="14.5" />
        </g>
      </svg>
    </div>
  );
}

function Frame1410081228() {
  return (
    <div className="content-stretch flex gap-[23px] items-center justify-start relative shrink-0">
      <div className="font-['Poppins:Regular',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#292929] text-[16.552px] text-nowrap">
        <p className="leading-[normal] whitespace-pre">Don’t Need extra Drivers?</p>
      </div>
      <Frame1410081226 />
    </div>
  );
}

function Frame1410081229() {
  return (
    <div className="content-stretch flex flex-col gap-4 items-start justify-start relative shrink-0 w-[323px]">
      <div className="font-['Poppins:Medium',_sans-serif] leading-[0] min-w-full not-italic relative shrink-0 text-[#292929] text-[26.035px]" style={{ width: "min-content" }}>
        <p className="leading-[normal]">Select Number of Drivers</p>
      </div>
      <Frame1410081228 />
    </div>
  );
}

function Frame1410081230() {
  return (
    <div className="h-[45px] relative shrink-0 w-[54px]">
      <div className="absolute bg-[#e5d8c5] bottom-[-4.44%] left-0 right-0 rounded-lg top-[-4.44%]" />
      <div className="absolute bottom-0 font-['Poppins:Light',_sans-serif] leading-[0] left-[33.33%] not-italic right-[37.04%] text-[#000000] text-[29.755px] text-nowrap top-0">
        <p className="leading-[normal] whitespace-pre">-</p>
      </div>
    </div>
  );
}

function Frame1410081231() {
  return (
    <div className="h-[45px] relative shrink-0 w-[54px]">
      <div className="absolute bg-[#ffffff] bottom-[-4.44%] left-0 right-0 rounded-lg top-[-4.44%]">
        <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.61)] border-solid inset-0 pointer-events-none rounded-lg" />
      </div>
      <div className="absolute bottom-0 font-['Poppins:Regular',_sans-serif] leading-[0] left-[40.74%] not-italic right-[40.74%] text-[#292929] text-[29.755px] text-nowrap top-0">
        <p className="leading-[normal] whitespace-pre">1</p>
      </div>
    </div>
  );
}

function Frame1410081232() {
  return (
    <div className="h-[45px] relative shrink-0 w-[54px]">
      <div className="absolute bg-[#e5d8c5] bottom-[-4.44%] left-0 right-0 rounded-lg top-[-4.44%]" />
      <div className="absolute bottom-0 font-['Poppins:Light',_sans-serif] leading-[0] left-[33.33%] not-italic right-[29.63%] text-[#000000] text-[29.755px] text-nowrap top-0">
        <p className="leading-[normal] whitespace-pre">+</p>
      </div>
    </div>
  );
}

function Frame1410081233() {
  return (
    <div className="content-stretch flex gap-4 items-center justify-start relative shrink-0">
      <Frame1410081230 />
      <Frame1410081231 />
      <Frame1410081232 />
    </div>
  );
}

function Frame1410081234() {
  return (
    <div className="content-stretch flex gap-20 items-center justify-start relative shrink-0">
      <Frame1410081229 />
      <Frame1410081233 />
    </div>
  );
}

function Frame1410081207() {
  return (
    <div className="bg-[#f7efe4] box-border content-stretch flex flex-col gap-2.5 h-[162px] items-center justify-start px-[34px] py-7 relative rounded-[13px] shrink-0 w-[667px]">
      <Frame1410081234 />
    </div>
  );
}

function Frame1410081546() {
  return (
    <div className="content-stretch flex flex-col gap-2.5 items-start justify-start relative shrink-0 w-full">
      <Frame1410081223 />
      <Frame1410081207 />
    </div>
  );
}

function Frame1410081225() {
  return (
    <div className="absolute bg-[#ffffff] box-border content-stretch flex flex-col gap-5 items-start justify-start left-0 pb-0 pt-[30px] px-0 rounded-[30px] top-[663px] w-[697px]">
      <ChooseYourRide />
      <Frame1410081546 />
    </div>
  );
}

function Frame1() {
  return <div className="bg-[69.16%_27.82%,_71.67%_76.45%] bg-no-repeat bg-size-[106.12%_96.09%,115.35%_115.35%] h-[92px] shrink-0 w-[98px]" data-name="Frame" style={{ backgroundImage: `url('${imgFrame2}'), url('${imgFrame3}')` }} />;
}

function Frame1410081235() {
  return (
    <div className="content-stretch flex flex-col gap-[7px] items-start justify-start leading-[0] not-italic relative shrink-0">
      <div className="font-['Poppins:Medium',_sans-serif] relative shrink-0 text-[#000000] text-[28px] text-nowrap">
        <p className="leading-[normal] whitespace-pre">Personal Driver</p>
      </div>
      <div className="font-['Poppins:Regular',_sans-serif] min-w-full relative shrink-0 text-[#656565] text-[18px]" style={{ width: "min-content" }}>
        <p className="leading-[normal]">Pickup and drop you</p>
      </div>
    </div>
  );
}

function Frame1410081238() {
  return (
    <div className="content-stretch flex gap-5 items-center justify-start relative shrink-0">
      <Frame1 />
      <Frame1410081235 />
    </div>
  );
}

function Frame1410081239() {
  return (
    <div className="content-stretch flex flex-col font-['Poppins:Regular',_sans-serif] gap-1 items-end justify-center leading-[0] not-italic relative shrink-0 text-[#000000]">
      <div className="relative shrink-0 text-[0px] text-nowrap">
        <p className="leading-[normal] whitespace-pre">
          <span className="text-[30px]">{`₹200.00 `}</span>
          <span className="font-['Poppins:Light',_sans-serif] not-italic text-[#555555] text-[20px]">/</span>
          <span className="text-[29.755px]"> </span>
          <span className="text-[18px]">hr.</span>
        </p>
      </div>
      <div className="flex flex-col justify-center min-w-full relative shrink-0 text-[16px] text-right" style={{ width: "min-content" }}>
        <p className="leading-[normal]">2 mins away</p>
      </div>
    </div>
  );
}

function Frame1410081240() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-[610px]">
      <Frame1410081238 />
      <Frame1410081239 />
    </div>
  );
}

function Frame1410081241() {
  return (
    <div className="content-stretch flex flex-col gap-[19px] items-start justify-start relative shrink-0 w-full">
      <Frame1410081240 />
      <div className="h-0 relative shrink-0 w-[620px]">
        <div className="absolute bottom-[-0.5px] left-0 right-0 top-[-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 620 2">
            <path d="M0 1H620" id="Vector 37" stroke="var(--stroke-0, black)" strokeOpacity="0.12" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame1410081242() {
  return (
    <div className="bg-[#ec932d] box-border content-stretch flex flex-col gap-[8.4px] items-center justify-center px-[7.56px] py-0 relative rounded-[10.5px] shrink-0 size-[21px]">
      <div className="font-['Poppins:Regular',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[13.903px] text-nowrap">
        <p className="leading-[normal] whitespace-pre">i</p>
      </div>
    </div>
  );
}

function Frame1410081243() {
  return (
    <div className="bg-[#f1f1f1] box-border content-stretch flex gap-[13px] items-end justify-start pl-2.5 pr-[15px] py-[7px] relative rounded-[38px] shadow-[0px_2px_3px_0px_rgba(0,0,0,0.07)] shrink-0">
      <Frame1410081242 />
      <div className="flex flex-col font-['Poppins:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#424242] text-[14px] text-nowrap">
        <p className="leading-[20px] whitespace-pre">Experienced and Authorized Drivers</p>
      </div>
    </div>
  );
}

function Frame1410081244() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-[607px]">
      <div className="flex flex-col font-['Poppins:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#545454] text-[14px] text-nowrap">
        <p className="leading-[20px] whitespace-pre">Pickup by 15:23</p>
      </div>
      <Frame1410081243 />
    </div>
  );
}

function Frame1410081245() {
  return (
    <div className="content-stretch flex flex-col gap-[18px] items-center justify-start relative shrink-0 w-[627px]">
      <Frame1410081241 />
      <Frame1410081244 />
    </div>
  );
}

function Frame1410081246() {
  return (
    <div className="bg-neutral-50 h-[213px] relative shrink-0 w-full">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2.5 h-[213px] items-start justify-start px-[33px] py-[21px] relative w-full">
          <Frame1410081245 />
        </div>
      </div>
    </div>
  );
}

function Frame1410081247() {
  return (
    <div className="absolute content-stretch flex flex-col items-start justify-start left-0 top-[1219px] w-[697px]">
      <Frame1410081246 />
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

function Frame1410081227() {
  return (
    <div className="absolute bg-[#ffffff] bottom-[0.05px] h-[200px] left-0 overflow-clip shadow-[0px_7px_35.3px_0px_rgba(0,0,0,0.15)] w-[697px]">
      <Button />
    </div>
  );
}

export default function Component3ChooseVehicle() {
  return (
    <div className="relative size-full" data-name="3. Choose Vehicle">
      <div className="absolute inset-0" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 698 1511">
          <path d={svgPaths.p3a371780} fill="var(--fill-0, white)" id="Vector" />
        </svg>
      </div>
      <div className="absolute bg-center bg-cover bg-no-repeat inset-[-1.99%_0.05%_31.26%_-0.86%]" data-name="image" style={{ backgroundImage: `url('${imgImage}')` }} />
      <div className="absolute bottom-[24.51%] flex items-center justify-center left-[-0.27%] right-[-0.27%] top-0">
        <div className="flex-none h-[701.095px] rotate-[90deg] w-[1139.98px]">
          <div className="size-full" data-name="arxivgooglestreet-10 1" />
        </div>
      </div>
      <Maps />
      <YourPickupPointDestination />
      <div className="absolute inset-[38.28%_87.81%_59.27%_8.17%]" data-name="Oval">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 37">
          <path d={svgPaths.p23784500} fill="var(--fill-0, black)" id="Oval" />
        </svg>
      </div>
      <div className="absolute h-[377px] left-[69px] top-[461.5px] w-[524px]">
        <div className="absolute inset-[-0.58%_-0.12%_-0.8%_-0.23%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 527 383">
            <path d={svgPaths.p109e7880} id="Vector 38" stroke="var(--stroke-0, black)" strokeWidth="3" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[36.82%_12.2%_61.7%_84.6%]" data-name="Vector">
        <div className="absolute inset-[-16.667%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31 31">
            <path d={svgPaths.p354bd900} id="Vector" stroke="var(--stroke-0, #CF923D)" strokeWidth="7.43868" />
          </svg>
        </div>
      </div>
      <Frame1410081225 />
      <Frame1410081247 />
      <AutoLayoutHorizontal1 />
      <Frame1410081227 />
      <div className="absolute bg-[#0f1d1a] h-[51.836px] rounded-[34.257px] top-[33.35px] translate-x-[-50%] w-[268.645px]" style={{ left: "calc(50% - 0.366px)" }} />
    </div>
  );
}