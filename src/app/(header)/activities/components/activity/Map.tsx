"use client";
import { useEffect } from "react";

import { Misc } from "@/components/icons";

export default function Map({ location }: { location: string }) {
  useEffect(() => {
    // 1. 카카오 지도 초기화
    kakao.maps.load(() => {
      // 2. 지도 생성 및 설정
      const container = document.getElementById("map");

      const options = {
        center: new kakao.maps.LatLng(37.502, 127.026581),
        level: 3,
        draggable: true,
      };
      const map = new kakao.maps.Map(container as HTMLElement, options);

      const geocoder = new kakao.maps.services.Geocoder(); // 3. 주소-좌표 변환 객체 생성

      // 4. 지도 상에 주소를 표시
      geocoder.addressSearch(location, function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
          // 5. 결과값으로 받은 위치를 마커로 표시
          const latitude = Number(result[0].y);
          const longitude = Number(result[0].x);
          const coords = new kakao.maps.LatLng(latitude, longitude);
          //마커 이미지 변경
          const imageSrc = "/maker.png"; // 마커이미지의 주소입니다
          const imageSize = new kakao.maps.Size(33, 33); // 마커이미지의 크기입니다

          const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

          // 결과값으로 받은 위치를 마커로 표시
          const marker = new kakao.maps.Marker({
            map: map,
            position: coords,
            // image: markerImage,
          });

          // 마커 클릭시 카카오 지도로 이동
          kakao.maps.event.addListener(marker, "click", function () {
            window.open(`https://map.kakao.com/link/map/선택위치,${latitude},${longitude}`);
          });

          // 커스텀 오버레이(주소텍스트 나타내는거)
          const overlay = new kakao.maps.CustomOverlay({
            position: coords,
            content: `<div style="
  position:absolute; right:-225px; bottom:10px;
  display:inline-flex; align-items:center; gap:6px;
  padding:10px; border-radius:24px; border:2px solid #0475F4; background:#fff;
  width:fit-content; max-width:calc(100vw - 48px);
  white-space:nowrap; box-sizing:border-box;
">
  <img src="/maker.png" style="width:33px;height:33px;flex:0 0 33px;" alt="">
  <p style="margin:0;font-weight:600;color:#171717;">${location}</p>
</div>`,
          });
          overlay.setMap(map);

          // 6. 지도의 중심을 결과값으로 받은 위치로 이동
          map.setCenter(coords);

          const handleResizeMap = () => {
            map.setCenter(coords);
            return;
          };

          window.addEventListener("resize", handleResizeMap);
          return () => window.removeEventListener("resize", handleResizeMap);
        }
      });
    });
  }, [location]);

  return (
    <div className="border-brand-nomad-black/25 flex flex-col gap-2 border-t py-[40px]">
      <div id="map" className="h-[450px] w-[100%] rounded-2xl" />
      <div className="flex gap-[2px]">
        <Misc.Location className="svg-fill h-5 w-5" />
        <p className="text-brand-nomad-black text-md font-normal">{location}</p>
      </div>
    </div>
  );
}
