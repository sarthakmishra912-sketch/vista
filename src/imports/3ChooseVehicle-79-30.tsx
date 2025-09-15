import svgPaths from "./svg-vxqx14szee";

function AutoLayoutHorizontal() {
  return (
    <div className="h-[20.924px] relative shrink-0 w-[122.054px]" data-name="Auto Layout Horizontal">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 123 21">
        <g id="Auto Layout Horizontal">
          <path d={svgPaths.p32edff00} fill="var(--fill-0, #170E2B)" id="Exclude" />
          <path d={svgPaths.p26b0000} fill="var(--fill-0, #170E2B)" id="Exclude_2" />
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
    <div className="absolute bg-white box-border content-stretch flex gap-[469.026px] h-[58px] items-center justify-center left-[-1px] overflow-clip px-0 py-[6.974px] top-0 w-[699px]" data-name="Auto Layout Horizontal">
      <div className="font-['Roboto:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#170e2b] text-[24.41px] text-nowrap tracking-[0.0244px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal] whitespace-pre">12:30</p>
      </div>
      <AutoLayoutHorizontal />
    </div>
  );
}

function Frame1410081618() {
  return (
    <div className="bg-[#282828] relative rounded-[30px] shrink-0 w-full">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex items-center justify-between p-[40px] relative w-full">
          <div className="flex flex-col font-['Poppins:Medium',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[36px] text-center text-nowrap text-white tracking-[-1.08px]">
            <p className="leading-[normal] whitespace-pre">OK</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame1410081633() {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col gap-2.5 items-start justify-start left-0 px-5 py-[30px] shadow-[0px_7px_35.3px_0px_rgba(0,0,0,0.15)] top-[1316px] w-[697px]">
      <Frame1410081618 />
    </div>
  );
}

function Frame1410081634() {
  return (
    <div className="absolute left-[302.38px] size-[92.624px] top-[589px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 93 93">
        <g id="Frame 1410081634">
          <rect fill="var(--fill-0, #38A35F)" height="92.624" rx="18.2811" width="92.624" />
          <path d={svgPaths.pdd3dd80} id="Vector 48" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="5.48883" />
        </g>
      </svg>
    </div>
  );
}

export default function Component3ChooseVehicle() {
  return (
    <div className="bg-white relative size-full" data-name="3. Choose Vehicle">
      <div className="flex flex-col items-center relative size-full">
        <div className="box-border content-stretch flex flex-col gap-[60px] items-center justify-start pb-10 pt-20 px-4 relative size-full">
          <AutoLayoutHorizontal1 />
          <Frame1410081633 />
          <div className="absolute font-['Poppins:Medium',_sans-serif] leading-[0] not-italic text-[#080a24] text-[48px] text-nowrap tracking-[-1.92px]" style={{ top: "calc(50% - 36.025px)", left: "calc(50% - 244.688px)" }}>
            <p className="leading-[normal] whitespace-pre">Thanks for your photo</p>
          </div>
          <Frame1410081634 />
        </div>
      </div>
    </div>
  );
}