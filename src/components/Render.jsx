'use client';

import React, { Fragment } from 'react';

/* eslint-disable */
// Generated from the Simbatech design export. Markup and logic mirror the original 1:1.

class Component extends React.Component {
  renderVals() {
    var k = this.props.kind ?? 'camera';
    return {
      isCamera: k === 'camera', isHeadphones: k === 'headphones', isSneaker: k === 'sneaker', isSofa: k === 'sofa',
      isEspresso: k === 'espresso', isDrill: k === 'drill', isTent: k === 'tent', isWatch: k === 'watch',
      isSkincare: k === 'skincare', isBike: k === 'bike', isBlocks: k === 'blocks', isPhone: k === 'phone'
    };
  }
}

export default class Render extends Component {
  render() {
    const vals = this.renderVals();
    return (
    <div style={{ width: "200px", height: "200px", position: "relative" }}>
      {" "}
      <svg width="0" height="0" style={{ position: "absolute" }} data-abs="misc" aria-hidden="true">
        <defs>
          <linearGradient id="rdk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4A515C" />
            <stop offset="1" stopColor="#14171B" />
          </linearGradient>
          <linearGradient id="rsilver" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FBFCFD" />
            <stop offset="1" stopColor="#B9C0C9" />
          </linearGradient>
          <linearGradient id="rcream" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#E7E0D2" />
          </linearGradient>
          <linearGradient id="rteal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3A95D6" />
            <stop offset="1" stopColor="#0D4F8B" />
          </linearGradient>
          <linearGradient id="ryellow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFE588" />
            <stop offset="1" stopColor="#F0AE00" />
          </linearGradient>
          <linearGradient id="rcoral" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFA786" />
            <stop offset="1" stopColor="#E0522B" />
          </linearGradient>
          <linearGradient id="rblue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#95D3FF" />
            <stop offset="1" stopColor="#2E7BD6" />
          </linearGradient>
          <linearGradient id="rpink" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFD6E6" />
            <stop offset="1" stopColor="#EE7AA6" />
          </linearGradient>
          <linearGradient id="rwood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#D9A36A" />
            <stop offset="1" stopColor="#9C652F" />
          </linearGradient>
          <linearGradient id="rscreen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1679BE" />
            <stop offset="1" stopColor="#418D4D" />
          </linearGradient>
          <radialGradient id="rring" cx="0.4" cy="0.35" r="0.7">
            <stop offset="0" stopColor="#6A717D" />
            <stop offset="1" stopColor="#16181C" />
          </radialGradient>
          <radialGradient id="rglass" cx="0.38" cy="0.32" r="0.75">
            <stop offset="0" stopColor="#7D92BE" />
            <stop offset="0.55" stopColor="#1B2438" />
            <stop offset="1" stopColor="#05070A" />
          </radialGradient>
          <radialGradient id="rs" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#000000" stopOpacity="0.28" />
            <stop offset="1" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
      {" "}
      {vals.isHeadphones ? (
        <>
          {" "}
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none" aria-hidden="true">
          <ellipse cx="100" cy="178" rx="64" ry="9" fill="url(#rs)" />
          <path d="M44 112C44 44 156 44 156 112" stroke="url(#rdk)" strokeWidth="13" strokeLinecap="round" />
          <path d="M53 102C56 60 144 60 147 102" stroke="#FFFFFF" strokeOpacity="0.15" strokeWidth="3" strokeLinecap="round" />
          <rect x="26" y="100" width="42" height="68" rx="20" fill="url(#rdk)" />
          <rect x="132" y="100" width="42" height="68" rx="20" fill="url(#rdk)" />
          <rect x="60" y="108" width="14" height="52" rx="7" fill="#2B2F36" />
          <rect x="126" y="108" width="14" height="52" rx="7" fill="#2B2F36" />
          <rect x="33" y="108" width="7" height="44" rx="3.5" fill="#FFFFFF" fillOpacity="0.18" />
          <rect x="139" y="108" width="7" height="44" rx="3.5" fill="#FFFFFF" fillOpacity="0.18" />
          <circle cx="47" cy="158" r="3.5" fill="#FFC93C" />
        </svg>
          {" "}
        </>
      ) : null}
      {" "}
      {vals.isCamera ? (
        <>
          {" "}
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none" aria-hidden="true">
          <ellipse cx="100" cy="176" rx="74" ry="9" fill="url(#rs)" />
          <path d="M74 66l10-18h40l10 18z" fill="url(#rdk)" />
          <rect x="24" y="64" width="152" height="100" rx="18" fill="url(#rdk)" />
          <rect x="24" y="74" width="34" height="90" rx="14" fill="#0D0F12" />
          <rect x="38" y="70" width="126" height="4" rx="2" fill="#FFFFFF" fillOpacity="0.16" />
          <rect x="140" y="78" width="22" height="10" rx="3" fill="#FFC93C" />
          <ellipse cx="44" cy="62" rx="10" ry="4" fill="#C9CDD3" />
          <circle cx="112" cy="116" r="44" fill="url(#rring)" />
          <circle cx="112" cy="116" r="34" fill="#0A0C10" />
          <circle cx="112" cy="116" r="26" fill="url(#rglass)" />
          <ellipse cx="102" cy="104" rx="9" ry="5" fill="#FFFFFF" fillOpacity="0.55" transform="rotate(-30 102 104)" />
          <circle cx="121" cy="126" r="3" fill="#FFFFFF" fillOpacity="0.35" />
        </svg>
          {" "}
        </>
      ) : null}
      {" "}
      {vals.isSneaker ? (
        <>
          {" "}
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none" aria-hidden="true">
          <ellipse cx="102" cy="162" rx="80" ry="8" fill="url(#rs)" />
          <path d="M22 138h150c8 0 12 4 12 9s-4 9-12 9H30c-6 0-10-4-10-9z" fill="#FFFFFF" stroke="#E2DDD3" strokeWidth="1.5" />
          <path d="M22 146h162" stroke="#FF7A45" strokeWidth="3" />
          <path d="M28 138c4-26 26-40 52-38l26-28c8-8 22-6 28 4l14 34c20 2 34 12 36 28z" fill="url(#rcream)" stroke="#E2DDD3" strokeWidth="1.5" />
          <path d="M60 126c30-4 60-18 84-34" stroke="url(#rcoral)" strokeWidth="11" strokeLinecap="round" />
          <path d="M106 80l10 8M100 87l10 8M94 94l10 8" stroke="#2B2F36" strokeWidth="3" strokeLinecap="round" />
          <path d="M150 106c14 3 25 11 29 23" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
        </svg>
          {" "}
        </>
      ) : null}
      {" "}
      {vals.isSofa ? (
        <>
          {" "}
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none" aria-hidden="true">
          <ellipse cx="100" cy="174" rx="88" ry="9" fill="url(#rs)" />
          <rect x="30" y="62" width="140" height="62" rx="20" fill="url(#rteal)" />
          <path d="M100 68v48" stroke="#0A3B66" strokeOpacity="0.45" strokeWidth="2" />
          <rect x="122" y="80" width="36" height="34" rx="10" fill="url(#ryellow)" transform="rotate(8 140 97)" />
          <rect x="24" y="112" width="152" height="40" rx="14" fill="#125A9C" />
          <rect x="32" y="113" width="136" height="9" rx="4.5" fill="#FFFFFF" fillOpacity="0.14" />
          <rect x="10" y="94" width="34" height="66" rx="16" fill="url(#rteal)" />
          <rect x="156" y="94" width="34" height="66" rx="16" fill="url(#rteal)" />
          <rect x="16" y="100" width="8" height="40" rx="4" fill="#FFFFFF" fillOpacity="0.2" />
          <rect x="24" y="158" width="8" height="15" rx="2" fill="url(#rwood)" />
          <rect x="168" y="158" width="8" height="15" rx="2" fill="url(#rwood)" />
        </svg>
          {" "}
        </>
      ) : null}
      {" "}
      {vals.isEspresso ? (
        <>
          {" "}
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none" aria-hidden="true">
          <ellipse cx="100" cy="176" rx="64" ry="8" fill="url(#rs)" />
          <rect x="46" y="26" width="108" height="140" rx="18" fill="url(#rsilver)" />
          <rect x="46" y="26" width="108" height="30" rx="16" fill="url(#rdk)" />
          <circle cx="128" cy="41" r="6" fill="#FFC93C" />
          <rect x="72" y="70" width="56" height="14" rx="5" fill="url(#rdk)" />
          <rect x="92" y="84" width="16" height="10" rx="2" fill="#2B2F36" />
          <rect x="56" y="100" width="88" height="54" rx="8" fill="#1A1D22" />
          <path d="M84 114h30v16a10 10 0 0 1-10 10h-10a10 10 0 0 1-10-10z" fill="#FFFFFF" />
          <path d="M114 118a6 6 0 0 1 0 12" stroke="#FFFFFF" strokeWidth="3" />
          <rect x="56" y="148" width="88" height="8" rx="3" fill="#C9CDD3" />
          <rect x="54" y="60" width="6" height="92" rx="3" fill="#FFFFFF" fillOpacity="0.55" />
          <path d="M140 76v30" stroke="#8A9099" strokeWidth="4" strokeLinecap="round" />
        </svg>
          {" "}
        </>
      ) : null}
      {" "}
      {vals.isDrill ? (
        <>
          {" "}
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none" aria-hidden="true">
          <ellipse cx="96" cy="180" rx="66" ry="8" fill="url(#rs)" />
          <path d="M30 52h92c14 0 24 10 24 24s-10 24-24 24H30c-6 0-10-4-10-10V62c0-6 4-10 10-10z" fill="url(#ryellow)" />
          <rect x="24" y="64" width="36" height="24" rx="6" fill="#1A1D22" />
          <rect x="34" y="57" width="90" height="5" rx="2.5" fill="#FFFFFF" fillOpacity="0.45" />
          <rect x="146" y="64" width="22" height="24" rx="4" fill="url(#rsilver)" />
          <path d="M168 76h22" stroke="#8A9099" strokeWidth="5" strokeLinecap="round" />
          <path d="M58 100l-10 50h40l8-50z" fill="url(#rdk)" />
          <path d="M92 102v14" stroke="#FFC93C" strokeWidth="6" strokeLinecap="round" />
          <rect x="36" y="146" width="68" height="26" rx="8" fill="url(#rdk)" />
          <rect x="44" y="153" width="20" height="4" rx="2" fill="#FFC93C" />
        </svg>
          {" "}
        </>
      ) : null}
      {" "}
      {vals.isTent ? (
        <>
          {" "}
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none" aria-hidden="true">
          <ellipse cx="100" cy="182" rx="90" ry="8" fill="url(#rs)" />
          <path d="M26 92v84M174 92v84M60 96v76M140 96v76" stroke="#B8BDC4" strokeWidth="5" strokeLinecap="round" />
          <path d="M14 88L100 30l86 58z" fill="url(#rcoral)" />
          <path d="M100 32L74 88M100 32l26 56" stroke="#FFFFFF" strokeWidth="9" />
          <path d="M14 88h172v10c-7 8-14 8-21 0-7 8-14 8-21 0-7 8-15 8-22 0-7 8-14 8-21 0-7 8-15 8-22 0-7 8-14 8-21 0-7 8-15 8-22 0-7 8-15 8-22 0z" fill="#FFFFFF" stroke="#EDE4DA" strokeWidth="1.5" />
          <circle cx="100" cy="28" r="5" fill="#FFC93C" />
        </svg>
          {" "}
        </>
      ) : null}
      {" "}
      {vals.isWatch ? (
        <>
          {" "}
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none" aria-hidden="true">
          <ellipse cx="100" cy="184" rx="44" ry="7" fill="url(#rs)" />
          <rect x="74" y="12" width="52" height="172" rx="20" fill="url(#rteal)" />
          <circle cx="100" cy="160" r="3" fill="#0A3B66" />
          <circle cx="100" cy="170" r="3" fill="#0A3B66" />
          <rect x="56" y="54" width="88" height="96" rx="28" fill="url(#rsilver)" />
          <rect x="144" y="86" width="8" height="20" rx="3" fill="url(#rsilver)" />
          <rect x="64" y="62" width="72" height="80" rx="22" fill="#0D0F12" />
          <circle cx="100" cy="102" r="24" stroke="#26303A" strokeWidth="5" />
          <circle cx="100" cy="102" r="24" stroke="#FFC93C" strokeWidth="5" strokeDasharray="100 200" strokeLinecap="round" transform="rotate(-90 100 102)" />
          <circle cx="100" cy="102" r="15" stroke="#5BB36A" strokeWidth="4" strokeDasharray="55 200" strokeLinecap="round" transform="rotate(-90 100 102)" />
          <path d="M70 70l24-6-24 30z" fill="#FFFFFF" fillOpacity="0.08" />
        </svg>
          {" "}
        </>
      ) : null}
      {" "}
      {vals.isSkincare ? (
        <>
          {" "}
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none" aria-hidden="true">
          <ellipse cx="100" cy="178" rx="66" ry="8" fill="url(#rs)" />
          <rect x="62" y="36" width="36" height="12" rx="4" fill="url(#rteal)" />
          <rect x="92" y="38" width="24" height="7" rx="3" fill="url(#rteal)" />
          <rect x="70" y="48" width="20" height="24" rx="4" fill="url(#rteal)" />
          <rect x="48" y="70" width="64" height="104" rx="16" fill="url(#rcream)" stroke="#E6DFD2" strokeWidth="1.5" />
          <rect x="54" y="104" width="52" height="42" rx="6" fill="#0D4F8B" />
          <rect x="62" y="114" width="30" height="4" rx="2" fill="#FFC93C" />
          <rect x="62" y="124" width="22" height="3" rx="1.5" fill="#FFFFFF" fillOpacity="0.7" />
          <rect x="62" y="131" width="28" height="3" rx="1.5" fill="#FFFFFF" fillOpacity="0.5" />
          <rect x="54" y="78" width="6" height="88" rx="3" fill="#FFFFFF" fillOpacity="0.7" />
          <rect x="132" y="72" width="12" height="22" rx="6" fill="#2B2F36" />
          <rect x="128" y="92" width="20" height="20" rx="4" fill="#2B2F36" />
          <rect x="118" y="110" width="40" height="64" rx="11" fill="url(#rpink)" />
          <rect x="123" y="116" width="5" height="50" rx="2.5" fill="#FFFFFF" fillOpacity="0.55" />
        </svg>
          {" "}
        </>
      ) : null}
      {" "}
      {vals.isBike ? (
        <>
          {" "}
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none" aria-hidden="true">
          <ellipse cx="100" cy="170" rx="90" ry="7" fill="url(#rs)" />
          <circle cx="50" cy="126" r="34" stroke="#1A1D22" strokeWidth="9" />
          <circle cx="150" cy="126" r="34" stroke="#1A1D22" strokeWidth="9" />
          <circle cx="50" cy="126" r="26" stroke="#C9CDD3" strokeWidth="2" />
          <circle cx="150" cy="126" r="26" stroke="#C9CDD3" strokeWidth="2" />
          <path d="M50 126L82 76h58l10 50M82 76l22 50 36-50M104 126H50" stroke="url(#rcoral)" strokeWidth="7" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M82 76l-3-12" stroke="#1A1D22" strokeWidth="4" strokeLinecap="round" />
          <path d="M68 62h24" stroke="#1A1D22" strokeWidth="7" strokeLinecap="round" />
          <path d="M140 76l-6-14h14" stroke="#1A1D22" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="104" cy="126" r="7" fill="#1A1D22" />
          <circle cx="50" cy="126" r="4" fill="#1A1D22" />
          <circle cx="150" cy="126" r="4" fill="#1A1D22" />
        </svg>
          {" "}
        </>
      ) : null}
      {" "}
      {vals.isBlocks ? (
        <>
          {" "}
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none" aria-hidden="true">
          <ellipse cx="104" cy="176" rx="74" ry="8" fill="url(#rs)" />
          <path d="M30 110l10-10h56l-10 10z" fill="#FFC2AE" />
          <path d="M86 110l10-10v56l-10 10z" fill="#C9431F" />
          <rect x="30" y="110" width="56" height="56" rx="6" fill="url(#rcoral)" />
          <path d="M96 110l10-10h56l-10 10z" fill="#C4E5FF" />
          <path d="M152 110l10-10v56l-10 10z" fill="#1F5FAE" />
          <rect x="96" y="110" width="56" height="56" rx="6" fill="url(#rblue)" />
          <path d="M62 44l10-10h56l-10 10z" fill="#FFF1B8" />
          <path d="M118 44l10-10v56l-10 10z" fill="#C99400" />
          <rect x="62" y="44" width="56" height="56" rx="6" fill="url(#ryellow)" />
          <text x="58" y="148" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="30" fontWeight="900" fill="#FFFFFF">
            A
          </text>
          <text x="124" y="148" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="30" fontWeight="900" fill="#FFFFFF">
            B
          </text>
          <text x="90" y="82" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="30" fontWeight="900" fill="#FFFFFF">
            C
          </text>
        </svg>
          {" "}
        </>
      ) : null}
      {" "}
      {vals.isPhone ? (
        <>
          {" "}
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none" aria-hidden="true">
          <ellipse cx="100" cy="186" rx="46" ry="6" fill="url(#rs)" />
          <rect x="58" y="12" width="84" height="170" rx="20" fill="url(#rdk)" />
          <rect x="64" y="18" width="72" height="158" rx="15" fill="url(#rscreen)" />
          <rect x="88" y="24" width="24" height="7" rx="3.5" fill="#0D0F12" />
          <text x="100" y="72" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="22" fontWeight="700" fill="#FFFFFF">
            09:41
          </text>
          <rect x="72" y="134" width="56" height="30" rx="10" fill="#FFFFFF" fillOpacity="0.18" />
          <rect x="80" y="144" width="26" height="4" rx="2" fill="#FFFFFF" fillOpacity="0.8" />
          <rect x="80" y="152" width="36" height="3" rx="1.5" fill="#FFFFFF" fillOpacity="0.5" />
          <path d="M66 22h34L66 96z" fill="#FFFFFF" fillOpacity="0.08" />
        </svg>
          {" "}
        </>
      ) : null}
      {" "}
    </div>
    );
  }
}
