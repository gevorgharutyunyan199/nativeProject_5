import {DeviceInfo} from './DeviceInfo';
let ratio = DeviceInfo.deviceWidth/375;

export const sizes = {
    size1p875: 1.875*ratio,
    size3p5: 3.5*ratio,
    size4p5: 4.5*ratio,
    size6p5: 6.5*ratio,
    size7p5: 7.5*ratio,
    size8p5: 8.5*ratio,
    size10p5: 10.5*ratio,
    size12p5: 12.5*ratio,
    size13p5: 13.5*ratio,
    size13p6: 13.6*ratio,
    size15p5: 15.5*ratio,
    size15p8: 15.8*ratio,
    size16p5: 16.5*ratio,
    size16p9: 16.9*ratio,
    size17p5: 17.5*ratio,
    size18p5: 18.5*ratio,
    size20p5: 20.5*ratio,
    size21p5: 21.5*ratio,
    size22p5: 22.5*ratio,
    size22p7: 22.7*ratio,
    size24p2: 24.2*ratio,
    size24p5: 24.5*ratio,
    size36p5: 36.5*ratio,
    size39p5: 39.5*ratio,
    size44p5: 44.5*ratio,
    size53p5: 53.5*ratio,
    size80p5: 80.5*ratio,
    size87p9: 87.9*ratio,
    size88p3: 88.3*ratio,
    size109p3: 109.3*ratio,
    size142p8: 142.8*ratio,
    size200p5: 200.5*ratio,
};

for (let i = 1; i < 450; i++) {
    sizes[`size${i}`] = i * ratio
}
