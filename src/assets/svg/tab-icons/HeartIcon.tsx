import * as React from "react"
import Svg, { Path } from "react-native-svg"
import AppStrings from "../../../constants/appStrings"

function HeartIcon(props: any) {
  return (
    <Svg
      width="26px"
      height="26px"
      viewBox="0 0 32 32"
      fill={AppStrings.appColor}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path d="M30.943 8.494c-.816-2.957-3.098-5.239-5.994-6.04l-.06-.014a9.282 9.282 0 00-2.169-.25 9.49 9.49 0 00-6.722 2.779 8.643 8.643 0 00-6.023-2.433c-.77 0-1.516.1-2.226.288l.06-.014c-3.104.882-5.499 3.277-6.365 6.317l-.016.065a8.59 8.59 0 00-.269 2.16 8.775 8.775 0 002.896 6.525l.008.007 11.381 12.619a.746.746 0 001.113.001l.001-.001 11.369-12.605a9.706 9.706 0 003.256-7.261c0-.759-.087-1.498-.252-2.208l.013.066z" />
    </Svg>
  )
}

export default HeartIcon

