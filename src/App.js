import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, ScatterChart, Scatter, ZAxis, ReferenceLine } from "recharts";

// ─── EMBEDDED POSITION DATA ─────────────────────────────────────────────────
const LOGS = [
  {
    id: "dec10_1556", label: "15:56", date: "Dec 10", rows: 28, duration: 50.7, hasGPS: false,
    xRange: 0.0809, yRange: 0.1491, zRange: 0.1005,
    xStd: 0.0213, yStd: 0.0358, zStd: 0.0261,
    maxSpread: 0.1379, meanSpread: 0.041, velMean: 0.0226, velMax: 0.0729,
    note: "XYZ-only · Stationary · Offset origin (X≈−27, Z≈−84)",
    t:[20.817,21.819,22.837,23.853,24.855,25.855,26.861,27.864,28.864,29.865,30.867,31.873,32.875,33.879,34.894,35.902,41.156,43.509,44.512,45.538,46.559,47.57,56.505,57.511,58.512,59.513,60.519,71.546],
    x:[-27.4117,-27.4134,-27.4259,-27.4338,-27.4369,-27.4414,-27.4426,-27.4225,-27.4201,-27.4304,-27.4346,-27.4363,-27.4372,-27.4375,-27.4358,-27.4263,-27.4326,-27.4352,-27.4372,-27.4382,-27.4383,-27.4378,-27.4694,-27.4835,-27.4814,-27.4927,-27.4857,-27.4423],
    y:[-0.1306,-0.1001,-0.0772,-0.0853,-0.11,-0.1107,-0.0886,-0.1264,-0.1368,-0.1204,-0.11,-0.1144,-0.1353,-0.1244,-0.1135,-0.1338,-0.107,-0.1119,-0.129,-0.1161,-0.1321,-0.1101,-0.0825,-0.0481,-0.0476,0.0123,-0.0293,-0.0698],
    z:[-84.2531,-84.2629,-84.2794,-84.28,-84.2531,-84.2518,-84.2608,-84.2203,-84.2008,-84.202,-84.2086,-84.2118,-84.209,-84.2134,-84.2227,-84.2291,-84.2525,-84.2324,-84.2236,-84.2274,-84.2184,-84.2357,-84.2293,-84.2552,-84.2612,-84.3012,-84.2676,-84.231],
  },
  {
    id: "dec10_1600", label: "16:00", date: "Dec 10", rows: 33, duration: 37.1, hasGPS: false,
    xRange: 0.177, yRange: 0.1313, zRange: 0.0957,
    xStd: 0.0418, yStd: 0.039, zStd: 0.0277,
    maxSpread: 0.1178, meanSpread: 0.0571, velMean: 0.0336, velMax: 0.1037,
    note: "XYZ-only · Stationary · Noise-floor test",
    t:[18.069,19.07,20.072,21.078,22.097,23.102,24.102,25.102,26.107,28.808,33.038,34.04,35.044,36.047,37.048,38.052,39.053,40.065,41.084,42.097,43.113,44.117,45.122,46.136,47.14,48.14,49.144,50.145,51.149,52.151,53.155,54.158,55.177],
    x:[-1.4922,-1.5,-1.5002,-1.5008,-1.4641,-1.4408,-1.4958,-1.5084,-1.5085,-1.5602,-1.5284,-1.5115,-1.5192,-1.5038,-1.4473,-1.446,-1.4732,-1.4856,-1.485,-1.5091,-1.56,-1.5853,-1.6178,-1.6032,-1.5727,-1.5474,-1.5273,-1.5248,-1.5317,-1.5363,-1.5305,-1.5284,-1.5261],
    y:[-0.1493,-0.1653,-0.1656,-0.1588,-0.0831,-0.0738,-0.153,-0.1765,-0.1575,-0.0952,-0.092,-0.0789,-0.0791,-0.0802,-0.0451,-0.0684,-0.0794,-0.0966,-0.0767,-0.0654,-0.0734,-0.0673,-0.0538,-0.0527,-0.0786,-0.0652,-0.0584,-0.0626,-0.1385,-0.1231,-0.0955,-0.1137,-0.1266],
    z:[-0.2162,-0.2116,-0.211,-0.2116,-0.2513,-0.2689,-0.2309,-0.2203,-0.223,-0.2703,-0.2505,-0.2693,-0.2694,-0.2671,-0.2935,-0.2525,-0.2273,-0.1991,-0.2033,-0.2424,-0.252,-0.2831,-0.2922,-0.2948,-0.2697,-0.2749,-0.2811,-0.2751,-0.2342,-0.2391,-0.2584,-0.2557,-0.245],
  },
  {
    id: "dec10_1613", label: "16:13", date: "Dec 10", rows: 34, duration: 77.4, hasGPS: false,
    xRange: 0.1545, yRange: 0.1237, zRange: 0.1543,
    xStd: 0.0361, yStd: 0.0352, zStd: 0.0452,
    maxSpread: 0.1554, meanSpread: 0.0603, velMean: 0.0151, velMax: 0.0449,
    note: "XYZ-only · Stationary · Longest Dec 10 run",
    t:[16.635,17.653,26.264,44.76,45.76,46.764,47.765,48.765,49.766,50.772,51.774,52.789,53.793,54.795,55.8,56.804,57.808,58.824,59.826,60.826,61.828,62.835,63.842,64.856,65.861,66.875,67.876,76.548,77.552,78.555,79.565,92.052,93.055,94.072],
    x:[-0.6143,-0.6092,-0.5753,-0.6435,-0.6438,-0.6438,-0.6434,-0.644,-0.6442,-0.6441,-0.6441,-0.6436,-0.6534,-0.6737,-0.677,-0.677,-0.6672,-0.6484,-0.6335,-0.6262,-0.6229,-0.623,-0.6333,-0.647,-0.6675,-0.6982,-0.7299,-0.7273,-0.7219,-0.7213,-0.7226,-0.6501,-0.6501,-0.65],
    y:[-0.2097,-0.2033,-0.1756,-0.2351,-0.2348,-0.2347,-0.234,-0.2316,-0.23,-0.2283,-0.2273,-0.212,-0.2147,-0.2249,-0.2263,-0.2256,-0.2157,-0.2046,-0.2092,-0.2051,-0.1963,-0.1862,-0.1813,-0.165,-0.1471,-0.1267,-0.1115,-0.1455,-0.1546,-0.1515,-0.1578,-0.2256,-0.2299,-0.2255],
    z:[-0.5917,-0.5912,-0.6102,-0.4927,-0.4928,-0.4937,-0.4943,-0.493,-0.4908,-0.4894,-0.4884,-0.4875,-0.4891,-0.4889,-0.4818,-0.4775,-0.4767,-0.4739,-0.4887,-0.5096,-0.5296,-0.5496,-0.5598,-0.5869,-0.5894,-0.6001,-0.6282,-0.5471,-0.5172,-0.5006,-0.5431,-0.5134,-0.5121,-0.5191],
  },
  {
    id: "dec18_1528", label: "15:28", date: "Dec 18", rows: 22, duration: 111.3, hasGPS: true,
    xRange: 0.3641, yRange: 0.3947, zRange: 0.2916,
    xStd: 0.0819, yStd: 0.0803, zStd: 0.059,
    maxSpread: 0.4219, meanSpread: 0.0991, velMean: 0.0569, velMax: 0.4736,
    gpsSpreadMax: 1.2782, gpsSpreadMean: 0.8734,
    latMean: 36.1086767, lonMean: 140.1005157,
    note: "GPS enabled · Stationary · First dual-sensor test",
    t:[18.149,19.161,28.675,29.676,33.915,34.918,35.918,36.92,41.152,42.153,46.715,102.04,103.04,104.046,105.067,106.072,117.997,121.09,122.102,124.236,125.243,129.453],
    x:[-1.6982,-1.9561,-1.9499,-1.9741,-1.922,-1.9217,-1.9325,-1.9595,-1.946,-1.8771,-1.8684,-1.9719,-1.9918,-2.0197,-2.0275,-2.0428,-2.025,-2.0218,-2.0623,-2.0502,-2.0367,-2.0357],
    y:[-0.4443,-0.1069,-0.0496,-0.1273,-0.1466,-0.1376,-0.1413,-0.116,-0.0749,-0.105,-0.1143,-0.1284,-0.1678,-0.1913,-0.262,-0.2042,-0.1809,-0.1105,-0.0877,-0.183,-0.1867,-0.1551],
    z:[-0.1702,-0.3922,-0.4618,-0.34,-0.2958,-0.2952,-0.2978,-0.2702,-0.2438,-0.3056,-0.3386,-0.3597,-0.3558,-0.3789,-0.3686,-0.3494,-0.3124,-0.3105,-0.3086,-0.273,-0.277,-0.2962],
    lat:[36.10867747,36.10867103,36.10867101,36.10867482,36.10868613,36.10868655,36.10868692,36.10868704,36.10868669,36.10868434,36.10868238,36.10867543,36.10867564,36.10867555,36.10867542,36.10867511,36.10867448,36.10866777,36.10866899,36.1086692,36.10866855,36.10866683],
    lon:[140.10052182,140.10052494,140.10051476,140.1005142,140.10051336,140.10051221,140.10051052,140.10050953,140.10051331,140.10051888,140.10052307,140.10052135,140.10052198,140.10052212,140.10052198,140.10052422,140.10051491,140.10050948,140.10050754,140.10050763,140.10050812,140.10050953],
  },
  {
    id: "dec18_1538", label: "15:38", date: "Dec 18", rows: 38, duration: 126.6, hasGPS: true,
    xRange: 4.3428, yRange: 0.2996, zRange: 1.5541,
    xStd: 0.7239, yStd: 0.0541, zStd: 0.2663,
    maxSpread: 4.3078, meanSpread: 0.3879, velMean: 0.0508, velMax: 0.4262,
    gpsSpreadMax: 3.6084, gpsSpreadMean: 0.3269,
    latMean: 36.10866117, lonMean: 140.10049358,
    note: "GPS enabled · Movement event detected · Walk/carry test",
    t:[17.87,40.246,41.255,45.558,46.561,47.563,48.566,51.478,52.486,53.502,54.515,80.947,81.949,82.953,83.954,100.446,101.447,102.448,103.451,104.454,105.461,106.461,107.464,123.072,124.073,125.079,126.082,127.095,133.093,134.097,135.114,136.125,137.125,138.147,141.396,142.401,143.402,144.43],
    x:[-4.8424,-1.3849,-1.3699,-1.3227,-1.3228,-0.9383,-0.8826,-0.8749,-0.6228,-0.5977,-0.5766,-0.5579,-0.5428,-0.535,-0.5374,-0.547,-0.5856,-0.5816,-0.558,-0.5502,-0.5257,-0.5154,-0.5222,-0.5728,-0.5763,-0.5553,-0.5221,-0.4996,-0.5394,-0.5588,-0.5737,-0.5387,-0.5289,-0.5474,-0.5662,-0.5673,-0.5645,-0.5873],
    y:[-0.1359,-0.0693,-0.0724,-0.0751,-0.1051,-0.2214,-0.1023,-0.0991,-0.1245,-0.0862,-0.0731,-0.0426,-0.0374,-0.0348,-0.0336,-0.0474,-0.0748,-0.0713,-0.0557,-0.0546,-0.0407,-0.0289,-0.0332,-0.0637,-0.0688,-0.0542,-0.0293,-0.0148,-0.0183,-0.0317,-0.0352,0.0782,0.055,0.0025,0.025,0.0402,0.0143,-0.0519],
    z:[1.7961,0.6531,0.6663,0.6156,0.6417,0.4967,0.4122,0.4131,0.314,0.2984,0.2719,0.2899,0.2714,0.2658,0.2682,0.2763,0.2956,0.2943,0.2742,0.2681,0.249,0.242,0.2421,0.2927,0.3011,0.2969,0.274,0.255,0.282,0.2958,0.2969,0.2865,0.2802,0.2812,0.2586,0.2481,0.257,0.2939],
    lat:[36.10866979,36.1086628,36.10866266,36.10866067,36.10866132,36.10866098,36.10866013,36.10865915,36.10865915,36.10865959,36.10866124,36.10866139,36.10866132,36.1086614,36.10866172,36.1086598,36.10865982,36.10866022,36.10866017,36.1086607,36.10866066,36.1086609,36.10866099,36.10866112,36.10866116,36.10866214,36.10866252,36.10866257,36.10866204,36.10866202,36.10866154,36.10866147,36.10866102,36.10866038,36.10865998,36.10865975,36.10865999,36.1086601],
    lon:[140.10053226,140.10049543,140.10049608,140.10049635,140.10049417,140.10049327,140.10049231,140.10049359,140.10049359,140.10049379,140.10049119,140.10049274,140.1004947,140.10049487,140.10049537,140.10048823,140.10048835,140.1004905,140.10049273,140.10049388,140.10049497,140.10049553,140.1004963,140.10048822,140.1004885,140.1004907,140.1004947,140.10049627,140.10049038,140.10049024,140.10049025,140.10049145,140.10049144,140.10049241,140.10049062,140.1004903,140.10049029,140.10049021],
  },
  {
    id: "dec18_1544", label: "15:44", date: "Dec 18", rows: 110, duration: 210.7, hasGPS: true,
    xRange: 0.1662, yRange: 0.164, zRange: 0.2729,
    xStd: 0.0277, yStd: 0.0428, zStd: 0.0368,
    maxSpread: 0.1875, meanSpread: 0.0566, velMean: 0.0232, velMax: 0.1208,
    gpsSpreadMax: 2.25, gpsSpreadMean: 0.5237,
    latMean: 36.10866475, lonMean: 140.10053813,
    note: "⭐ KEY TEST — Stationary 210s · XYZ holds 0.19 m · GPS wanders 2.25 m",
    t:[122.652,123.654,124.656,127.199,128.204,129.214,130.216,131.226,132.237,133.244,134.259,135.261,136.265,137.266,138.268,139.269,140.271,141.277,142.293,143.296,144.297,145.299,146.301,147.306,148.321,149.327,150.341,151.343,152.344,153.347,154.349,155.361,156.365,157.373,158.379,226.892,227.893,234.196,235.211,236.224,239.135,248.663,249.668,253.126,254.128,255.128,256.129,257.131,258.135,259.139,260.156,261.159,262.16,263.162,264.168,265.17,266.188,267.202,268.204,269.211,270.212,271.228,272.231,273.234,274.241,275.254,276.257,277.259,278.26,279.263,280.264,281.266,282.266,283.275,284.293,285.306,286.308,287.31,288.312,289.315,290.32,291.322,292.324,293.325,294.327,295.329,298.369,299.374,300.402,301.412,302.414,303.416,304.439,305.45,306.451,307.461,308.475,309.493,310.494,311.496,312.498,313.503,317.431,319.218,320.232,321.235,322.25,331.371,332.374,333.379],
    x:[-0.4327,-0.4262,-0.4338,-0.4361,-0.4342,-0.4324,-0.4312,-0.4319,-0.4321,-0.4309,-0.4271,-0.4255,-0.4256,-0.452,-0.4694,-0.4704,-0.4449,-0.3993,-0.3627,-0.3708,-0.3954,-0.4298,-0.4433,-0.441,-0.4391,-0.4323,-0.4466,-0.4491,-0.45,-0.4783,-0.4772,-0.4819,-0.4785,-0.4713,-0.4544,-0.4311,-0.4235,-0.4153,-0.4163,-0.4194,-0.3965,-0.4347,-0.4389,-0.4286,-0.4462,-0.4505,-0.4447,-0.4399,-0.4382,-0.4349,-0.4294,-0.4274,-0.4271,-0.425,-0.4247,-0.4253,-0.4262,-0.4268,-0.427,-0.427,-0.4266,-0.426,-0.4255,-0.4263,-0.4345,-0.4317,-0.4306,-0.4326,-0.4354,-0.4379,-0.4395,-0.4412,-0.4411,-0.442,-0.4234,-0.4087,-0.4089,-0.4101,-0.4114,-0.4094,-0.3979,-0.4241,-0.4819,-0.4853,-0.455,-0.4462,-0.4572,-0.4445,-0.4136,-0.3986,-0.381,-0.3855,-0.4192,-0.3953,-0.3742,-0.3814,-0.3895,-0.3833,-0.3853,-0.3858,-0.3761,-0.3533,-0.4106,-0.4244,-0.4231,-0.4124,-0.4023,-0.5195,-0.4799,-0.4561],
    y:[-0.0827,-0.1127,-0.1177,-0.1184,-0.1183,-0.1185,-0.119,-0.1154,-0.1124,-0.113,-0.1126,-0.1111,-0.0896,-0.0443,-0.0379,-0.0449,-0.0346,-0.0343,-0.0254,-0.0399,-0.035,-0.0391,-0.0489,-0.0235,-0.0205,-0.0263,-0.0274,-0.0273,-0.0106,-0.0217,-0.0314,-0.0088,-0.0234,-0.0205,-0.0043,-0.0226,-0.0228,-0.0463,-0.0551,-0.0645,-0.0058,-0.0466,-0.0426,-0.0667,-0.0598,-0.0594,-0.0802,-0.0633,-0.0838,-0.1122,-0.14,-0.1433,-0.1434,-0.1434,-0.143,-0.1418,-0.1398,-0.1385,-0.1383,-0.1379,-0.1378,-0.1378,-0.1378,-0.1114,-0.0519,-0.0665,-0.0802,-0.093,-0.0825,-0.0894,-0.0874,-0.0795,-0.0747,-0.073,-0.1022,-0.1449,-0.1493,-0.1474,-0.1351,-0.1173,-0.1125,-0.0951,-0.0826,-0.0994,-0.1236,-0.1274,-0.1079,-0.0937,-0.1056,-0.1156,-0.1107,-0.1311,-0.1683,-0.1437,-0.1244,-0.1262,-0.0832,-0.0798,-0.078,-0.0879,-0.0499,-0.0124,-0.1308,-0.1286,-0.1127,-0.0477,-0.0826,-0.0712,-0.0746,-0.0794],
    z:[-0.048,-0.0362,-0.0391,-0.0475,-0.0476,-0.0471,-0.0458,-0.0457,-0.0492,-0.05,-0.0472,-0.0469,-0.0456,-0.079,-0.07,-0.065,-0.0833,-0.1014,-0.0903,-0.0656,-0.0699,-0.0653,-0.0781,-0.1013,-0.102,-0.0966,-0.0689,-0.0668,-0.0987,-0.0929,-0.0679,-0.02,-0.0077,-0.0374,-0.1111,-0.0486,-0.0501,-0.0314,-0.0284,-0.0299,-0.0831,-0.048,-0.0586,-0.0689,-0.0758,-0.0965,-0.0935,-0.1076,-0.0832,-0.043,-0.0269,-0.023,-0.0221,-0.0127,-0.0125,-0.0149,-0.0179,-0.0196,-0.02,-0.0206,-0.0208,-0.0208,-0.0207,-0.0312,-0.0931,-0.0911,-0.0795,-0.0706,-0.0777,-0.0723,-0.0717,-0.0797,-0.0799,-0.0811,-0.0609,-0.0336,-0.0321,-0.0332,-0.0401,-0.064,-0.0716,-0.0873,-0.0673,-0.0229,-0.0058,0.0006,-0.0315,-0.0721,-0.0629,-0.0487,-0.0428,-0.0321,-0.0162,-0.0313,-0.048,-0.0454,-0.039,-0.0583,-0.0896,-0.0869,-0.1456,-0.2106,-0.0294,-0.0192,-0.0284,-0.1301,-0.1368,0.0074,0.0367,0.0623],
    lat:[36.10866613,36.10866607,36.1086662,36.10866695,36.10866685,36.10866686,36.10866684,36.10866565,36.10866606,36.10866671,36.108666,36.10866573,36.10866544,36.10866266,36.10866342,36.10866327,36.10866506,36.10866621,36.10866944,36.10866868,36.10866712,36.10866445,36.10866355,36.10866345,36.10866346,36.10866372,36.10866406,36.10866413,36.10866214,36.10866041,36.10866312,36.10866677,36.10866749,36.10866445,36.108662,36.10866599,36.10866588,36.10866492,36.10866501,36.10866502,36.10866483,36.10866225,36.10866234,36.10866209,36.10866212,36.10866059,36.10866013,36.10866039,36.1086611,36.10866447,36.10866511,36.1086648,36.10866459,36.10866475,36.10866476,36.10866467,36.10866462,36.10866461,36.10866457,36.10866469,36.10866469,36.10866472,36.10866465,36.10866383,36.10866169,36.10866164,36.10866161,36.10866138,36.10866132,36.10866129,36.10866125,36.10866123,36.10866115,36.10866124,36.10866442,36.10866585,36.1086659,36.10866548,36.10866541,36.10866286,36.10866415,36.1086609,36.10865887,36.10866231,36.10866591,36.10866657,36.10866057,36.1086596,36.1086631,36.1086667,36.10867107,36.1086718,36.10867223,36.10867202,36.10867247,36.10867226,36.10867078,36.10866798,36.10866469,36.10866545,36.10866242,36.10866033,36.10866526,36.10866558,36.10866354,36.1086604,36.10866228,36.10866735,36.10867254,36.10867706],
    lon:[140.10053633,140.10053604,140.10053576,140.10053566,140.10053557,140.10053552,140.10053551,140.10053533,140.10053565,140.10053555,140.10053487,140.10053666,140.10053423,140.10053419,140.10053046,140.10053378,140.10053816,140.10054406,140.10054571,140.10054346,140.10054101,140.10053658,140.10053791,140.10053881,140.10053872,140.10053854,140.10053423,140.10053476,140.10053605,140.10053302,140.10053162,140.10052645,140.10052621,140.10053186,140.10053915,140.10053723,140.10053673,140.10053622,140.10053604,140.10053645,140.10053622,140.10053725,140.10053747,140.1005379,140.10053835,140.10053862,140.10054185,140.10054206,140.10053962,140.10053685,140.10053612,140.10053636,140.10053649,140.10053656,140.10053648,140.10053646,140.10053645,140.10053641,140.1005365,140.10053648,140.10053653,140.10053656,140.10053654,140.10053745,140.10053848,140.10053883,140.1005386,140.10053869,140.10053865,140.1005386,140.10053863,140.10053868,140.10053861,140.1005387,140.10054105,140.10054183,140.10054165,140.10054208,140.10054246,140.10054573,140.10054748,140.10054297,140.10053206,140.10052518,140.10052742,140.10052571,140.10052964,140.10053697,140.10054233,140.10054609,140.10054889,140.10054679,140.10054563,140.10054761,140.10054864,140.10054774,140.10054641,140.1005492,140.10054957,140.10055151,140.10055113,140.10055141,140.10053859,140.10053913,140.10054387,140.1005471,140.10055172,140.10051887,140.10051786,140.10051829],
  },
  {
    id: "dec18_1557", label: "15:57", date: "Dec 18", rows: 79, duration: 110.7, hasGPS: true,
    xRange: 0.5027, yRange: 0.4331, zRange: 0.2268,
    xStd: 0.1734, yStd: 0.1437, zStd: 0.0648,
    maxSpread: 0.4612, meanSpread: 0.2012, velMean: 0.027, velMax: 0.0877,
    gpsSpreadMax: 1.4405, gpsSpreadMean: 0.6399,
    latMean: 36.10866974, lonMean: 140.1005377,
    note: "GPS enabled · Position shift mid-session · Two-phase test",
    t:[27.686,28.695,29.712,30.728,31.73,34.236,35.24,36.242,37.245,38.246,39.249,40.25,41.252,42.254,43.258,44.259,45.264,46.279,60.19,61.213,62.219,63.224,67.766,68.786,69.787,70.788,71.789,72.803,73.812,74.822,75.824,76.826,77.831,78.833,79.836,80.844,81.845,82.848,83.858,84.874,85.881,86.881,87.882,88.892,94.185,95.195,96.195,97.197,98.208,99.21,100.221,101.226,102.226,103.231,104.234,105.237,106.238,107.241,108.243,109.249,117.078,118.085,119.092,120.632,122.28,123.282,124.284,125.285,126.287,127.29,128.294,129.296,130.299,131.303,132.308,135.351,136.352,137.37,138.383],
    x:[-0.3515,-0.3558,-0.3586,-0.3626,-0.3639,-0.3685,-0.3939,-0.4303,-0.4391,-0.4489,-0.4624,-0.4668,-0.4609,-0.444,-0.4514,-0.4585,-0.4212,-0.3818,-0.3866,-0.3848,-0.3869,-0.3976,-0.4109,-0.407,-0.4078,-0.4096,-0.3967,-0.3884,-0.387,-0.3865,-0.3795,-0.3608,-0.3626,-0.3767,-0.3782,-0.3783,-0.3594,-0.3304,-0.3682,-0.426,-0.4716,-0.4739,-0.4724,-0.4987,-0.3887,-0.3478,-0.3298,-0.3287,-0.3217,-0.3215,-0.3329,-0.3379,-0.3299,-0.3301,-0.3503,-0.3597,-0.3759,-0.3866,-0.3909,-0.392,-0.7869,-0.7836,-0.7813,-0.7725,-0.7592,-0.7659,-0.7733,-0.7857,-0.7988,-0.7826,-0.7806,-0.7806,-0.7824,-0.7939,-0.8243,-0.7957,-0.7792,-0.7748,-0.7762],
    y:[-0.1341,-0.1363,-0.1377,-0.1409,-0.1351,-0.1264,-0.1101,-0.0936,-0.0979,-0.0937,-0.0851,-0.0856,-0.0977,-0.1034,-0.097,-0.0806,-0.0768,-0.0792,-0.1052,-0.1131,-0.1237,-0.1111,-0.1432,-0.1518,-0.1392,-0.1192,-0.1258,-0.1371,-0.1396,-0.1276,-0.1101,-0.0958,-0.0969,-0.1348,-0.1356,-0.1341,-0.0988,-0.0807,-0.0919,-0.0855,-0.0874,-0.0956,-0.098,-0.0832,-0.114,-0.1033,-0.1044,-0.104,-0.0955,-0.0959,-0.1065,-0.1087,-0.1029,-0.1057,-0.114,-0.1131,-0.1105,-0.126,-0.1192,-0.117,0.2195,0.2044,0.219,0.268,0.1744,0.1743,0.1724,0.2342,0.2545,0.2537,0.2163,0.1724,0.2145,0.2533,0.2813,0.2385,0.1769,0.2211,0.22],
    z:[-0.1731,-0.1751,-0.18,-0.1813,-0.1789,-0.1692,-0.2065,-0.2187,-0.2071,-0.1995,-0.1998,-0.1891,-0.1821,-0.1803,-0.1966,-0.2335,-0.252,-0.2582,-0.1556,-0.1767,-0.1975,-0.2331,-0.1933,-0.1874,-0.1896,-0.216,-0.2165,-0.2038,-0.1995,-0.2044,-0.2365,-0.2517,-0.2541,-0.2328,-0.234,-0.236,-0.2503,-0.2708,-0.2646,-0.2744,-0.2708,-0.2398,-0.234,-0.2668,-0.1245,-0.1185,-0.1382,-0.1501,-0.1461,-0.1472,-0.1543,-0.1558,-0.1574,-0.1633,-0.1935,-0.2343,-0.2641,-0.238,-0.2372,-0.232,-0.0808,-0.0746,-0.077,-0.0851,-0.0476,-0.0566,-0.0596,-0.0889,-0.1136,-0.1049,-0.0893,-0.0701,-0.0667,-0.1042,-0.182,-0.08,-0.0523,-0.0568,-0.0882],
    lat:[36.10867019,36.10867035,36.10867055,36.10867093,36.10867247,36.10866966,36.10866551,36.10866359,36.10866537,36.10866505,36.10866483,36.10866565,36.10866617,36.10866632,36.10866388,36.10866165,36.10866298,36.10866414,36.10867699,36.10867281,36.10866844,36.10866361,36.10866811,36.108668,36.10866683,36.10866526,36.108667,36.10866888,36.1086688,36.10866824,36.10866687,36.1086678,36.10866791,36.10866782,36.10866784,36.10866773,36.10866805,36.10866881,36.10866442,36.10866141,36.10866139,36.1086631,36.10866075,36.10865839,36.10867799,36.10867804,36.10867668,36.10867605,36.10867765,36.10867688,36.10867597,36.10867628,36.10867669,36.10867569,36.10867114,36.10866709,36.10866451,36.10866567,36.10866507,36.10866641,36.10867629,36.10867578,36.10867264,36.10867229,36.10867453,36.10867461,36.10867436,36.10867298,36.10867203,36.10867263,36.10867398,36.10867553,36.10867578,36.10867317,36.10866687,36.10867549,36.1086761,36.10867612,36.10867598],
    lon:[140.10054135,140.10054124,140.1005412,140.10054066,140.10053948,140.10053934,140.10053741,140.10053321,140.10053123,140.10052948,140.10052845,140.10052707,140.10052685,140.10052706,140.10052918,140.10053257,140.10053799,140.10054356,140.10053667,140.1005386,140.10054037,140.10053832,140.10053152,140.10053176,140.10053234,140.1005343,140.10053659,140.10053714,140.10053668,140.10053904,140.10054256,140.10054394,140.1005433,140.10054253,140.10054265,140.1005428,140.10054572,140.10054676,140.10054284,140.10053646,140.10053249,140.10053068,140.10052989,140.10053001,140.10052884,140.10053416,140.10053862,140.10053947,140.10053925,140.10053982,140.10053897,140.10053963,140.1005406,140.10054079,140.10054231,140.10054372,140.10054222,140.10053998,140.10053934,140.10053986,140.10053809,140.10053771,140.10053942,140.10054034,140.10053818,140.10053862,140.10053869,140.10053901,140.1005393,140.1005403,140.10053886,140.10053824,140.1005386,140.10053975,140.10054011,140.10053906,140.10053799,140.10053788,140.10053731],
  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const latToM = (lat, latMean) => (lat - latMean) * 111320;
const lonToM = (lon, lonMean, latMean) => (lon - lonMean) * 111320 * Math.cos(latMean * Math.PI / 180);

// ─── STEAMPUNK DECORATIVE LAYER (matches portal) ────────────────────────────
const RivetCorner = ({ pos }) => {
  const s = { tl:{top:5,left:5}, tr:{top:5,right:5}, bl:{bottom:5,left:5}, br:{bottom:5,right:5} };
  return <div style={{ position:"absolute", ...s[pos], width:9, height:9, borderRadius:"50%", background:"radial-gradient(circle at 35% 35%,#d4a84b,#8a6914)", boxShadow:"0 1px 2px rgba(0,0,0,.6)", zIndex:2 }} />;
};
const Panel = ({ children, style={} }) => (
  <div style={{ position:"relative", border:"1px solid #3d3020", borderRadius:6, background:"linear-gradient(145deg,#1e1a14,#151210)", boxShadow:"inset 0 1px 0 rgba(212,168,75,.1),0 2px 12px rgba(0,0,0,.4)", ...style }}>
    <RivetCorner pos="tl"/><RivetCorner pos="tr"/><RivetCorner pos="bl"/><RivetCorner pos="br"/>
    {children}
  </div>
);
const BrassLabel = ({ children }) => (
  <div style={{ fontSize:9, fontFamily:"'Share Tech Mono',monospace", textTransform:"uppercase", letterSpacing:2.5, color:"#8a7a5a", borderBottom:"1px solid #3d3020", padding:"6px 14px", background:"rgba(61,48,32,.3)" }}>
    {children}
  </div>
);
const Mono = ({ children, style={} }) => <span style={{ fontFamily:"'Share Tech Mono',monospace", ...style }}>{children}</span>;

// ─── CUSTOM TOOLTIP ──────────────────────────────────────────────────────────
const XYZTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"rgba(15,13,10,.95)", border:"1px solid #3d3020", borderRadius:5, padding:"8px 12px", boxShadow:"0 4px 16px rgba(0,0,0,.5)" }}>
      <Mono style={{ fontSize:9, color:"#8a7a5a", display:"block", marginBottom:4 }}>t = {label?.toFixed?.(1) ?? label} s</Mono>
      {payload.map((p,i) => <Mono key={i} style={{ fontSize:10, color:p.color, display:"block" }}>{p.name}: {typeof p.value === "number" ? p.value.toFixed(4) : p.value} m</Mono>)}
    </div>
  );
};

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function PositionAnalysis() {
  const [selected, setSelected] = useState("dec18_1544");
  const [showX, setShowX] = useState(true);
  const [showY, setShowY] = useState(true);
  const [showZ, setShowZ] = useState(true);
  const [view, setView] = useState("timeline"); // timeline | scatter | compare

  const log = useMemo(() => LOGS.find(l => l.id === selected), [selected]);

  // Build XYZ series for recharts
  const xyzData = useMemo(() => {
    if (!log) return [];
    return log.t.map((t, i) => ({ t, X: log.x[i], Y: log.y[i], Z: log.z[i] }));
  }, [log]);

  // Build GPS scatter (metres from centroid)
  const gpsScatter = useMemo(() => {
    if (!log?.hasGPS) return [];
    return log.lat.map((lat, i) => ({
      x: parseFloat(lonToM(log.lon[i], log.lonMean, log.latMean).toFixed(3)),
      y: parseFloat(latToM(lat, log.latMean).toFixed(3)),
      t: log.t[i],
    }));
  }, [log]);

  // Comparison data: all Dec 18 logs, XYZ spread vs GPS spread
  const compareData = useMemo(() =>
    LOGS.filter(l => l.hasGPS).map(l => ({
      name: l.label,
      "XYZ Spread": l.maxSpread,
      "GPS Spread": l.gpsSpreadMax,
    }))
  , []);

  const isKey = selected === "dec18_1544";

  return (
    <div style={{ minHeight:"100vh", background:"#0c0a07", backgroundImage:"radial-gradient(ellipse at 20% 50%,rgba(139,38,53,.06),transparent 50%),radial-gradient(ellipse at 80% 20%,rgba(180,120,51,.04),transparent 50%)", fontFamily:"'DM Sans',sans-serif", color:"#e8dcc8" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Share+Tech+Mono&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

      {/* ── NAV ── */}
      <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 24px", borderBottom:"1px solid #2e2518", background:"linear-gradient(180deg,#161210,#0f0d0a)", boxShadow:"0 2px 12px rgba(0,0,0,.5)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#d4a84b"><path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.03-.3.07-.62.07-.97s-.04-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.03.34-.07.67-.07 1s.02.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.58 1.69-.98l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66z"/></svg>
          <div>
            <div style={{ fontFamily:"'Cinzel',serif", fontSize:16, fontWeight:700, color:"#d4a84b", letterSpacing:3 }}>MINARVIS</div>
            <div style={{ fontSize:7, fontFamily:"'Share Tech Mono',monospace", color:"#6a5f4a", letterSpacing:2 }}>POSITION LOG ANALYSIS</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:6 }}>
          {[["timeline","⟿  Timeline"],["scatter","◎  GPS Scatter"],["compare","⟿⟿  Spread Compare"]].map(([v,l]) => (
            <button key={v} onClick={() => setView(v)} style={{
              padding:"7px 14px", borderRadius:4, cursor:"pointer", border: view===v ? "1px solid #4a3820" : "1px solid transparent",
              background: view===v ? "linear-gradient(135deg,#2a1f14,#1e1710)" : "transparent",
              color: view===v ? "#d4a84b" : "#7a6f5a", fontFamily:"'Share Tech Mono',monospace", fontSize:10, letterSpacing:1, transition:"all .2s"
            }}>{l}</button>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 10px", border:"1px solid #3d3020", borderRadius:4, background:"rgba(30,26,20,.6)" }}>
          <span style={{ width:8, height:8, borderRadius:"50%", background:"#6dba4a", boxShadow:"0 0 6px #6dba4a", display:"inline-block" }} />
          <Mono style={{ fontSize:9, color:"#6dba4a" }}>7 LOGS LOADED</Mono>
        </div>
      </nav>

      <div style={{ padding:"18px 24px", maxWidth:1440, margin:"0 auto", display:"flex", flexDirection:"column", gap:14 }}>

        {/* ── KEY FINDING BANNER ── */}
        <Panel style={{ borderColor:"#c47a3a66", background:"linear-gradient(135deg,rgba(196,122,58,.12),rgba(139,38,53,.08))" }}>
          <div style={{ padding:"12px 18px", display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ fontSize:28 }}>⭐</div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'Cinzel',serif", fontSize:14, fontWeight:600, color:"#d4a84b", marginBottom:3 }}>Key Finding — Stationary Accuracy Test (15:44, Dec 18)</div>
              <Mono style={{ fontSize:10, color:"#c47a3a" }}>Device stationary for 210 s. Visual-tracking XYZ spread: <span style={{color:"#6dba4a",fontWeight:700}}>0.19 m</span> · Raw GPS (lat/lon) spread: <span style={{color:"#8b3030",fontWeight:700}}>2.25 m</span> · RTK-dominant fusion holds 12× tighter than uncorrected GNSS.</Mono>
            </div>
            <button onClick={() => { setSelected("dec18_1544"); setView("timeline"); }} style={{ padding:"6px 14px", borderRadius:4, background:"rgba(196,122,58,.2)", border:"1px solid #c47a3a66", color:"#c47a3a", fontFamily:"'Share Tech Mono',monospace", fontSize:10, cursor:"pointer", letterSpacing:1 }}>INSPECT →</button>
          </div>
        </Panel>

        {/* ── LOG SELECTOR ── */}
        <Panel>
          <BrassLabel>⚙ Session Log Selector</BrassLabel>
          <div style={{ padding:"10px 14px", display:"flex", gap:10, flexWrap:"wrap" }}>
            {["Dec 10","Dec 18"].map(date => (
              <div key={date}>
                <Mono style={{ fontSize:8, color:"#5a5040", display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:1.5 }}>{date}</Mono>
                <div style={{ display:"flex", gap:5 }}>
                  {LOGS.filter(l => l.date === date).map(l => {
                    const active = selected === l.id;
                    const isKF = l.id === "dec18_1544";
                    return (
                      <button key={l.id} onClick={() => setSelected(l.id)} style={{
                        padding:"6px 12px", borderRadius:4, cursor:"pointer",
                        background: active ? (isKF ? "rgba(196,122,58,.22)" : "rgba(212,168,75,.14)") : "rgba(30,26,20,.5)",
                        border: active ? `1px solid ${isKF?"#c47a3a66":"#d4a84b44"}` : "1px solid #2a2419",
                        color: active ? (isKF?"#c47a3a":"#d4a84b") : "#7a6f5a",
                        fontFamily:"'Share Tech Mono',monospace", fontSize:10, letterSpacing:0.8, transition:"all .15s",
                        boxShadow: active ? `0 0 8px ${isKF?"rgba(196,122,58,.2)":"rgba(212,168,75,.15)"}` : "none"
                      }}>
                        {isKF && <span style={{marginRight:4}}>⭐</span>}
                        {l.label}
                        {l.hasGPS && <span style={{color:"#4a9fd4", marginLeft:4, fontSize:8}}>GPS</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:14 }}>

          {/* ── MAIN CHART AREA ── */}
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

            {/* XYZ TIMELINE */}
            {view === "timeline" && (
              <Panel>
                <BrassLabel>⚙ XYZ Position — Time Series</BrassLabel>
                <div style={{ padding:"8px 14px", display:"flex", gap:12, alignItems:"center" }}>
                  {[["X","#4a9fd4",showX,setShowX],["Y","#6dba4a",showY,setShowY],["Z","#c47a3a",showZ,setShowZ]].map(([axis,color,on,toggle]) => (
                    <button key={axis} onClick={() => toggle(!on)} style={{
                      display:"flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:3, cursor:"pointer",
                      background: on ? `${color}18` : "rgba(30,26,20,.4)", border: on ? `1px solid ${color}44` : "1px solid #2a2419",
                      color: on ? color : "#5a5040", fontFamily:"'Share Tech Mono',monospace", fontSize:10
                    }}>
                      <span style={{width:10,height:10,borderRadius:"50%",background: on ? color : "#3d3020"}}/>
                      {axis}-axis
                    </button>
                  ))}
                </div>
                <div style={{ padding:"0 14px 14px", height:280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={xyzData} margin={{top:8,right:16,left:0,bottom:4}}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2419" />
                      <XAxis dataKey="t" stroke="#5a5040" tick={{fontSize:9,fill:"#5a5040",fontFamily:"Share Tech Mono"}} label={{value:"Time (s)",position:"insideBottomRight",offset:-4,fill:"#5a5040",fontSize:9,fontFamily:"Share Tech Mono"}}/>
                      <YAxis stroke="#5a5040" tick={{fontSize:9,fill:"#5a5040",fontFamily:"Share Tech Mono"}} label={{value:"m",position:"insideTopLeft",offset:2,fill:"#5a5040",fontSize:9,fontFamily:"Share Tech Mono"}}/>
                      <Tooltip content={<XYZTooltip />} />
                      {showX && <Line type="monotone" dataKey="X" stroke="#4a9fd4" strokeWidth={1.5} dot={false} animationDuration={600}/>}
                      {showY && <Line type="monotone" dataKey="Y" stroke="#6dba4a" strokeWidth={1.5} dot={false} animationDuration={600}/>}
                      {showZ && <Line type="monotone" dataKey="Z" stroke="#c47a3a" strokeWidth={1.5} dot={false} animationDuration={600}/>}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Panel>
            )}

            {/* GPS SCATTER */}
            {view === "scatter" && (
              <Panel>
                <BrassLabel>⚙ GPS Position Scatter — Metres from Centroid</BrassLabel>
                {log?.hasGPS ? (
                  <div style={{ padding:"0 14px 14px", height:340 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{top:16,right:16,left:0,bottom:4}}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2a2419" />
                        <XAxis type="number" dataKey="x" name="Longitude" stroke="#5a5040" tick={{fontSize:9,fill:"#5a5040",fontFamily:"Share Tech Mono"}} label={{value:"Δ Lon (m)",position:"insideBottomRight",offset:-4,fill:"#8a7a5a",fontSize:9,fontFamily:"Share Tech Mono"}} domain={['auto','auto']}/>
                        <YAxis type="number" dataKey="y" name="Latitude" stroke="#5a5040" tick={{fontSize:9,fill:"#5a5040",fontFamily:"Share Tech Mono"}} label={{value:"Δ Lat (m)",position:"insideTopLeft",offset:2,fill:"#8a7a5a",fontSize:9,fontFamily:"Share Tech Mono"}} domain={['auto','auto']}/>
                        <ZAxis range={[28,28]} />
                        <Tooltip cursor={{strokeDasharray:"3 3"}} content={({active,payload}) => {
                          if (!active||!payload?.length) return null;
                          const d = payload[0]?.payload;
                          return (
                            <div style={{background:"rgba(15,13,10,.95)",border:"1px solid #3d3020",borderRadius:5,padding:"7px 10px"}}>
                              <Mono style={{fontSize:9,color:"#8a7a5a",display:"block"}}>t = {d?.t?.toFixed(1)} s</Mono>
                              <Mono style={{fontSize:9,color:"#4a9fd4",display:"block"}}>ΔLon = {d?.x?.toFixed(3)} m</Mono>
                              <Mono style={{fontSize:9,color:"#6dba4a",display:"block"}}>ΔLat = {d?.y?.toFixed(3)} m</Mono>
                            </div>
                          );
                        }}/>
                        <Scatter data={gpsScatter} fill="#4a9fd4" fillOpacity={0.7} stroke="#4a9fd4" strokeWidth={1} style={{filter:"drop-shadow(0 0 2px rgba(74,159,212,.4))"}} />
                        <ReferenceLine x={0} stroke="#3d3020" strokeDasharray="4 4" />
                        <ReferenceLine y={0} stroke="#3d3020" strokeDasharray="4 4" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div style={{ padding:"40px 0", textAlign:"center" }}>
                    <Mono style={{ fontSize:11, color:"#5a5040" }}>No GPS data in this session — Dec 10 logs are XYZ-only</Mono>
                  </div>
                )}
              </Panel>
            )}

            {/* SPREAD COMPARISON */}
            {view === "compare" && (
              <Panel>
                <BrassLabel>⚙ Max Spread Comparison — XYZ vs Raw GPS (Dec 18 logs)</BrassLabel>
                <div style={{ padding:"4px 14px 4px", display:"flex", gap:16, alignItems:"center" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:5 }}><span style={{width:12,height:12,borderRadius:2,background:"#d4a84b",display:"inline-block"}}/><Mono style={{fontSize:9,color:"#8a7a5a"}}>XYZ Spread</Mono></div>
                  <div style={{ display:"flex", alignItems:"center", gap:5 }}><span style={{width:12,height:12,borderRadius:2,background:"#8b3030",display:"inline-block"}}/><Mono style={{fontSize:9,color:"#8a7a5a"}}>GPS Spread</Mono></div>
                  <Mono style={{ fontSize:9, color:"#5a5040", marginLeft:"auto" }}>Lower = tighter position hold</Mono>
                </div>
                <div style={{ padding:"0 14px 14px", height:300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={compareData} margin={{top:8,right:16,left:0,bottom:4}}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2419" />
                      <XAxis dataKey="name" stroke="#5a5040" tick={{fontSize:10,fill:"#8a7a5a",fontFamily:"Share Tech Mono"}} />
                      <YAxis stroke="#5a5040" tick={{fontSize:9,fill:"#5a5040",fontFamily:"Share Tech Mono"}} label={{value:"metres",position:"insideTopLeft",offset:2,fill:"#5a5040",fontSize:9,fontFamily:"Share Tech Mono"}} />
                      <Tooltip content={({active,payload,label}) => {
                        if (!active||!payload?.length) return null;
                        return (
                          <div style={{background:"rgba(15,13,10,.95)",border:"1px solid #3d3020",borderRadius:5,padding:"8px 12px"}}>
                            <Mono style={{fontSize:10,color:"#e8dcc8",display:"block",marginBottom:4}}>{label}</Mono>
                            {payload.map((p,i) => <Mono key={i} style={{fontSize:10,color:p.color,display:"block"}}>{p.name}: {p.value?.toFixed(3)} m</Mono>)}
                          </div>
                        );
                      }}/>
                      <Bar dataKey="XYZ Spread" fill="#d4a84b" radius={[3,3,0,0]} barSize={32} />
                      <Bar dataKey="GPS Spread" fill="#8b3030" radius={[3,3,0,0]} barSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Panel>
            )}
          </div>

          {/* ── STATS SIDEBAR ── */}
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

            {/* Session card */}
            <Panel style={{ borderColor: isKey ? "#c47a3a66" : "#3d3020" }}>
              <BrassLabel>⚙ Session Details</BrassLabel>
              <div style={{ padding:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:8 }}>
                  <div style={{ fontFamily:"'Cinzel',serif", fontSize:16, fontWeight:600, color: isKey ? "#c47a3a" : "#d4a84b" }}>{log?.date} — {log?.label}</div>
                  {log?.hasGPS && <span style={{ fontSize:8, fontFamily:"'Share Tech Mono',monospace", padding:"2px 7px", borderRadius:3, background:"rgba(74,159,212,.15)", border:"1px solid #4a9fd444", color:"#4a9fd4" }}>GPS+XYZ</span>}
                </div>
                <Mono style={{ fontSize:9, color:"#8a7a5a", display:"block", lineHeight:1.7 }}>{log?.note}</Mono>
              </div>
            </Panel>

            {/* Spread gauges */}
            <Panel>
              <BrassLabel>⚙ Position Spread</BrassLabel>
              <div style={{ padding:14 }}>
                {[
                  { label:"XYZ Max Spread", value: log?.maxSpread, unit:"m", color:"#d4a84b" },
                  { label:"XYZ Mean Spread", value: log?.meanSpread, unit:"m", color:"#8a7a5a" },
                  ...(log?.hasGPS ? [
                    { label:"GPS Max Spread", value: log?.gpsSpreadMax, unit:"m", color:"#8b3030" },
                    { label:"GPS Mean Spread", value: log?.gpsSpreadMean, unit:"m", color:"#8b5a5a" },
                  ] : []),
                ].map((s,i) => {
                  const maxVal = log?.hasGPS ? Math.max(log.maxSpread, log.gpsSpreadMax) : log?.maxSpread;
                  const pct = (s.value / maxVal) * 100;
                  return (
                    <div key={i} style={{ marginBottom: i < 3 ? 10 : 0 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                        <Mono style={{ fontSize:9, color:"#8a7a5a" }}>{s.label}</Mono>
                        <Mono style={{ fontSize:11, color:s.color, fontWeight:700 }}>{s.value?.toFixed(4)} {s.unit}</Mono>
                      </div>
                      <div style={{ height:5, background:"#1a1814", borderRadius:3, overflow:"hidden" }}>
                        <div style={{ width:`${pct}%`, height:"100%", background:s.color, borderRadius:3, boxShadow:`0 0 6px ${s.color}55`, transition:"width .6s" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Panel>

            {/* Axis ranges */}
            <Panel>
              <BrassLabel>⚙ Axis Detail</BrassLabel>
              <div style={{ padding:0 }}>
                {[
                  { axis:"X", range: log?.xRange, std: log?.xStd, color:"#4a9fd4" },
                  { axis:"Y", range: log?.yRange, std: log?.yStd, color:"#6dba4a" },
                  { axis:"Z", range: log?.zRange, std: log?.zStd, color:"#c47a3a" },
                ].map((a,i) => (
                  <div key={a.axis} style={{ display:"flex", alignItems:"center", padding:"9px 14px", borderBottom: i<2?"1px solid #1e1c18":"none" }}>
                    <span style={{ width:20, height:20, borderRadius:"50%", background:`${a.color}18`, border:`1px solid ${a.color}44`, display:"flex", alignItems:"center", justifyContent:"center", marginRight:10 }}>
                      <Mono style={{ fontSize:11, color:a.color, fontWeight:700 }}>{a.axis}</Mono>
                    </span>
                    <div style={{ flex:1 }}>
                      <Mono style={{ fontSize:9, color:"#8a7a5a" }}>Range: <span style={{color:"#e8dcc8"}}>{a.range?.toFixed(4)} m</span></Mono>
                    </div>
                    <Mono style={{ fontSize:9, color:"#5a5040" }}>σ {a.std?.toFixed(4)}</Mono>
                  </div>
                ))}
              </div>
            </Panel>

            {/* Velocity */}
            <Panel>
              <BrassLabel>⚙ Frame Velocity</BrassLabel>
              <div style={{ padding:14, display:"flex", gap:12 }}>
                <div style={{ flex:1, textAlign:"center" }}>
                  <Mono style={{ fontSize:8, color:"#5a5040", display:"block", textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Mean</Mono>
                  <Mono style={{ fontSize:18, color:"#d4a84b", fontWeight:700 }}>{log?.velMean?.toFixed(3)}</Mono>
                  <Mono style={{ fontSize:8, color:"#5a5040", display:"block" }}>m/s</Mono>
                </div>
                <div style={{ width:1, background:"#2a2419" }} />
                <div style={{ flex:1, textAlign:"center" }}>
                  <Mono style={{ fontSize:8, color:"#5a5040", display:"block", textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Peak</Mono>
                  <Mono style={{ fontSize:18, color: log?.velMax > 0.3 ? "#8b3030" : "#c47a3a", fontWeight:700 }}>{log?.velMax?.toFixed(3)}</Mono>
                  <Mono style={{ fontSize:8, color:"#5a5040", display:"block" }}>m/s</Mono>
                </div>
              </div>
              {log?.velMax > 0.3 && (
                <div style={{ margin:"0 14px 10px", padding:"5px 8px", background:"rgba(139,48,48,.12)", borderRadius:3, border:"1px solid #8b303033" }}>
                  <Mono style={{ fontSize:8, color:"#8b3030" }}>⚠ Peak velocity spike — possible device pick-up or movement event</Mono>
                </div>
              )}
            </Panel>

            {/* Metadata */}
            <Panel>
              <BrassLabel>⚙ Metadata</BrassLabel>
              <div style={{ padding:"10px 14px" }}>
                {[
                  ["Samples", log?.rows],
                  ["Duration", `${log?.duration} s`],
                  ["Sample Rate", `~1 Hz`],
                  ...(log?.hasGPS ? [["Lat", log?.latMean?.toFixed(8)], ["Lon", log?.lonMean?.toFixed(8)]] : []),
                ].map(([k,v],i) => (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"3px 0", borderBottom:"1px solid #1e1c18" }}>
                    <Mono style={{ fontSize:9, color:"#5a5040" }}>{k}</Mono>
                    <Mono style={{ fontSize:9, color:"#8a7a5a" }}>{v}</Mono>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      </div>

      <style>{`
        .recharts-cartesian-axis-tick text { fill:#5a5040; font-family:'Share Tech Mono',monospace; font-size:9px; }
        .recharts-tooltip-wrapper { outline:none !important; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-track { background:#1a1814; }
        ::-webkit-scrollbar-thumb { background:#3d3020; border-radius:3px; }
      `}</style>
    </div>
  );
}
