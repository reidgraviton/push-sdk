// @ts-nocheck
import * as React from 'react';
import Svg, {Circle, Path } from 'react-native-svg';

const BscSvgComponent = (props: any) => (
  <Svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Circle cx="12" cy="12" r="12" fill="#1D1D1D" />
    <Path
      d="M8.16193 12L6.58295 13.579L5 12L6.57898 10.421L8.16193 12ZM12 8.16193L14.7085 10.8705L16.2875 9.29148L12 5L7.70852 9.29148L9.2875 10.8705L12 8.16193ZM17.417 10.421L15.8381 12L17.417 13.579L18.996 12L17.417 10.421ZM12 15.8381L9.29148 13.1295L7.7125 14.7085L12 19L16.2875 14.7085L14.7085 13.1295L12 15.8381ZM12 13.579L13.579 12L12 10.421L10.417 12L12 13.579Z"
      fill="#F0B90B"
    />
  </Svg>
);

export default BscSvgComponent;
