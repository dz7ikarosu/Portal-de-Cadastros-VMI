import * as React from 'react';
import { useState, useEffect, useRef, useCallback } from "react";

// ══════════════════════════════════════════════════════════════════
// CONFIG
// ══════════════════════════════════════════════════════════════════
const CONFIG = {
  SUPABASE_URL:      "https://vkabwxpdodomreehomkl.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrYWJ3eHBkb2RvbXJlZWhvbWtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MjIyNjgsImV4cCI6MjA5NDI5ODI2OH0.vE6X1fOrSZBSrHb-_GQhSPAFwFrf6qAuGt9iooJxnTI",
  GOOGLE_SHEET_ID:   "1B-tcXd8_5CUPMpFdnu7lvynzHXkf1U8LoRfK9A6CiM0",
};

// ── SVG LOGO VMI (inline, sempre disponível) ──────────────────────
const VMI_LOGO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 841.89 595.28">
<polygon fill="#F4B61A" points="309.122,370.172 183.036,370.172 56.988,370.172 56.759,370.172 183.036,289.991"/>
<polygon fill="#F4B61A" points="179.864,284.551 53.328,364.863 117.259,244.093 179.883,124.242"/>
<polygon fill="#F4B61A" points="186.208,284.551 312.763,364.863 248.813,244.093 186.195,124.242"/>
<path fill="#F4B61A" d="M575.916,279.579l34.859-64.232l79.834,148.763l0.805,1.51c1.777,2.689,4.865,4.527,8.398,4.527c5.525,0,9.953-4.477,9.953-9.844c0-1.287-0.191-2.537-0.666-3.666l-0.99-1.953l-88.346-164.966c-1.674-3.19-5.125-5.36-8.988-5.36c-3.963,0-7.211,2.331-8.816,5.708l-26.043,47.002l-26.033-47.002c-1.611-3.377-4.857-5.708-8.828-5.708c-3.857,0-7.309,2.169-8.982,5.36l-88.346,164.966l-0.996,1.953c-0.469,1.129-0.652,2.379-0.652,3.666c0,5.367,4.408,9.844,9.945,9.844c3.527,0,6.615-1.838,8.393-4.527l0.811-1.51l79.828-148.763L575.916,279.579z"/>
<path fill="#F4B61A" d="M575.916,380.486c3.971,0,7.186-2.373,8.898-5.607c6.426-12.121,25.791-48.359,25.791-48.359s15.381,28.113,20.26,37.545l1.064,1.871c1.713,2.551,4.764,4.148,8.127,4.148c5.529,0,9.977-4.479,9.977-9.832c0-1.293-0.52-3.127-0.869-4.109l-0.729-1.396c-7.326-13.637-37.938-70.756-37.938-70.756l-34.582,65.232l-34.861-65.232c0,0-30.479,57.119-37.805,70.756l-0.742,1.396c-0.342,0.982-0.863,2.816-0.863,4.109c0,5.354,4.447,9.832,9.984,9.832c3.355,0,6.406-1.598,8.125-4.148l1.066-1.871c4.877-9.432,20.234-37.545,20.234-37.545s19.383,36.238,25.803,48.359C568.57,378.113,571.945,380.486,575.916,380.486"/>
<path fill="#F4B61A" d="M575.916,336.123l34.859-65.371l50.193,93.535c1.572,3.406,5.018,5.834,9.082,5.834c5.57,0,9.979-4.49,9.979-9.844c0-1.383-0.229-2.715-0.754-3.895l-0.705-1.42l-67.795-126.737l-34.859,65.279l-34.861-65.279l-67.801,126.737l-0.697,1.42c-0.521,1.18-0.756,2.512-0.756,3.895c0,5.354,4.428,9.844,9.984,9.844c4.059,0,7.504-2.428,9.084-5.834l50.186-93.535L575.916,336.123z"/>
<path fill="#F4B61A" d="M717.414,194.297c0.064-5.534,4.473-9.939,9.947-9.939c5.557,0,9.99,4.456,9.99,10.063l-0.014,165.857c0,5.367-4.439,9.863-9.977,9.863c-5.525,0-9.959-4.496-9.959-9.863L717.414,194.297z"/>
<path fill="#F4B61A" d="M743.637,194.297c0.051-5.534,4.465-9.939,9.939-9.939c5.557,0,9.984,4.456,9.984,10.063l-0.006,165.857c0,5.367-4.434,9.863-9.979,9.863c-5.518,0-9.959-4.496-9.959-9.863L743.637,194.297z"/>
<path fill="#F4B61A" d="M769.854,194.297c0.049-5.534,4.471-9.939,9.945-9.939c5.562,0,9.99,4.456,9.99,10.063l-0.02,165.857c0,5.367-4.428,9.863-9.971,9.863c-5.525,0-9.965-4.496-9.965-9.863L769.854,194.297z"/>
<path fill="#F4B61A" d="M412.97,269.106l-8.709-16.504c0,0-21.478-39.875-28.226-53.703c-0.521-1.047-1.079-2.924-1.079-4.548c0-5.623,4.402-10.092,9.946-10.092c4.136,0,7.649,2.48,9.166,6.061l18.902,35.962l18.901-35.962c1.523-3.581,5.037-6.061,9.166-6.061c5.545,0,9.959,4.469,9.959,10.092c0,1.624-0.559,3.501-1.084,4.548c-6.75,13.828-28.233,53.703-28.233,53.703L412.97,269.106z"/>
<path fill="#F4B61A" d="M412.97,325.379c0,0-52.26-98.387-67.128-126.48c-0.552-1.047-1.097-2.934-1.097-4.599c0-5.585,4.427-10.06,9.958-10.06c4.098,0,7.599,2.455,9.134,6l49.133,92.351l49.146-92.351c1.521-3.546,5.029-6,9.121-6c5.537,0,9.965,4.475,9.965,10.06c0,1.665-0.545,3.552-1.104,4.599C465.23,226.992,412.97,325.379,412.97,325.379"/>
<path fill="#F4B61A" d="M412.97,370.248c-3.755,0-6.984-2.016-8.595-5.035c-22.22-41.572-88.219-166.324-88.219-166.324l0.038-0.016c-0.691-1.364-1.097-2.857-1.097-4.462c0-5.604,4.453-10.06,9.99-10.06c4.034,0,7.32,2.468,9.07,5.852c19.562,37.887,78.812,148.725,78.812,148.725s59.251-110.838,78.806-148.725c1.758-3.384,5.043-5.852,9.09-5.852c5.523,0,9.977,4.456,9.977,10.06c0,1.605-0.418,3.099-1.09,4.462l0.037,0.016c0,0-66.221,125.025-88.212,166.324C419.966,368.232,416.725,370.248,412.97,370.248"/>
<path fill="#FFFFFF" d="M61.891,471.115v-6.762c4.041,1.498,8.607,2.246,13.701,2.246c6.19,0,9.273-2.068,9.273-6.197c0-3-1.897-4.516-5.69-4.516h-6.317c-8.246,0-12.375-3.75-12.375-11.273c0-8.27,5.874-12.406,17.621-12.406c4.51,0,8.792,0.66,12.832,1.973v6.768c-4.041-1.496-8.322-2.258-12.832-2.258c-6.768,0-10.143,1.979-10.143,5.924c0,3.008,1.637,4.512,4.897,4.512h6.317c8.779,0,13.162,3.754,13.162,11.277c0,8.455-5.582,12.68-16.746,12.68C70.498,473.082,65.931,472.422,61.891,471.115"/>
<polygon fill="#FFFFFF" points="190.368,432.486 190.368,438.918 170.185,438.918 170.185,449.066 189.411,449.066 189.411,455.752 170.096,455.752 170.096,466.32 190.768,466.32 190.768,472.803 162.77,472.803 162.77,432.486"/>
<path fill="#FFFFFF" d="M293.893,471.115c-3.482,1.307-7.428,1.967-11.842,1.967c-14.475,0-21.706-6.99-21.706-21.002c0-13.25,7.231-19.873,21.706-19.873c4.415,0,8.36,0.66,11.842,1.973v6.768c-3.482-1.496-7.237-2.258-11.278-2.258c-9.68,0-14.52,4.467-14.52,13.391c0,9.686,4.84,14.52,14.52,14.52c4.041,0,7.795-0.748,11.278-2.246V471.115z"/>
<path fill="#FFFFFF" d="M365.029,456.957v-24.471h7.466v24.471c0,6.426,3.292,9.643,9.87,9.643c6.584,0,9.863-3.217,9.863-9.643v-24.471h7.472v24.471c0,10.752-5.779,16.125-17.335,16.125C370.814,473.082,365.029,467.709,365.029,456.957"/>
<path fill="#FFFFFF" d="M472.246,472.752v-40.266h18.324c8.227,0,12.344,3.604,12.344,10.809c0,4.859-3.197,8.893-9.609,12.084l12.768,17.424h-9.412l-12.268-17.559v-3.418c7.143-1.225,10.719-3.99,10.719-8.316c0-2.967-1.68-4.451-5.023-4.451h-10.23v33.693H472.246z"/>
<rect x="573.682" y="432.492" fill="#FFFFFF" width="7.473" height="40.311"/>
<polygon fill="#FFFFFF" points="680.055,432.486 680.055,438.982 668.498,438.982 668.498,472.803 661.025,472.803 661.025,438.982 649.469,438.982 649.469,432.486"/>
<polygon fill="#FFFFFF" points="744.848,432.486 752.879,432.486 764.213,451.914 774.869,432.486 782.621,432.486 767.791,458.709 767.791,472.803 760.326,472.803 760.326,458.709"/>
</svg>`;

function Logo({ height=40 }: { height?: number }) {
  return <div style={{ height, display:"flex", alignItems:"center" }} dangerouslySetInnerHTML={{ __html: VMI_LOGO.replace('viewBox="0 0 841.89 595.28"', `viewBox="0 0 841.89 595.28" height="${height}" style="display:block"`) }}/>;
}

// ══════════════════════════════════════════════════════════════════
// PALETA
// ══════════════════════════════════════════════════════════════════
const C = {
  bg:"#0C0F16", surface:"#131825", surfaceMid:"#1A2035",
  border:"#232D42", borderLight:"#2C3750",
  yellow:"#F4B61A", yellowDim:"#F4B61A18", yellowBorder:"#F4B61A35",
  text:"#E8ECF4", textSub:"#8B96B0", textMuted:"#4A5568",
  green:"#22C55E", greenDim:"#22C55E15", red:"#EF4444", redDim:"#EF444415",
  blue:"#3B82F6", blueDim:"#3B82F615", purple:"#8B5CF6", purpleDim:"#8B5CF615",
  orange:"#F97316", orangeDim:"#F9731615", amber:"#F59E0B", amberDim:"#F59E0B15",
};

const STATUS_CFG: Record<string,{c:string,bg:string}> = {
  "Rascunho":                { c:"#e9d527", bg:"#50607215" },
  "Enviado":                 { c:"#3B82F6", bg:"#3B82F615" },
  "Em validação automática": { c:"#F59E0B", bg:"#F59E0B15" },
  "Em análise MDM":          { c:"#F4B61A", bg:"#F4B61A15" },
  "Aguardando Ajuste":       { c:"#F97316", bg:"#F9731615" },
  "Reprovado":               { c:"#EF4444", bg:"#EF444415" },
  "Aprovado":                { c:"#22C55E", bg:"#22C55E15" },
  "Integrado no Protheus":   { c:"#8B5CF6", bg:"#8B5CF615" },
  "Finalizado":              { c:"#22C55E", bg:"#8B96B015" },
};

const EQUIPE = [
  { name:"Icaro Batista",    initials:"IB", role:"Desenvolvedor / Assist. MDM"  },
  { name:"Heraldo Carvalho", initials:"HC", role:"Analista de MDM"              },
  { name:"Adriana Diniz",    initials:"AD", role:"Gerente de Processos"         },
  { name:"Willian Teixeira", initials:"WT", role:"Jovem Aprendiz"               },
];

const USERS_MDM = [
  { user:"icaro.batista",    pass:"Abobri.9919873"  },
  { user:"willian.teixeira", pass:"wt@prime2025!@#" },
  { user:"heraldo.carvalho", pass:"eng1252"         },
  { user:"adriana.diniz",    pass:"eng1253"         },
];
const USER_DEV = { user:"icaro.batistadev", pass:"ib@prime2025!@#" };

// ── GRUPOS PROTHEUS (fixos no código, baseados no arquivo oficial) ─
const GRUPOS_PROTHEUS = [
  "20 - MATERIAL ELETROELETRONICO",
  "2001 - CONECTORES/BORNES","2002 - CONTATORES/DISJUNTORES/BOTOES","2003 - FONTES",
  "2004 - SENSORES","2005 - GERADOR/TUBOS DE RAIOS-X","2006 - ACELERADORES",
  "2007 - NO-BREAK","2008 - PLACAS ELETRONICAS - PCI'S","2009 - DETECTORES RAIOS-X",
  "2010 - CPU, COMPUTADOR, NOTEBOOK","2011 - CABOS","2012 - DISCOS RIGIDOS",
  "2013 - TERMINAIS","2014 - MOTORES","2015 - FILTROS","2016 - RESISTORES",
  "2017 - FUSIVEIS","2018 - TRANSFORMADORES","2019 - MONITORES",
  "2020 - LAMPADAS/LEDS/LUMINARIAS ETC","2021 - LENTES","2022 - INTERRUPTORES/COMUTADORES",
  "2023 - TECLADOS","2024 - HD/PEN DRIVE/C.MEMORIA ETC","2025 - COOLER/MICRO-VENTILADOR",
  "2026 - DIODOS","2027 - SINALIZADORES - INDICADORES","2028 - RETIFICADORES",
  "2029 - TRANSISTORES","2030 - DISPOSITIVOS PARADA DE EMERGENCIA",
  "2031 - CONDENSADORA","2032 - EVAPORADORA","2033 - CONTROLE REMOTO",
  "2034 - ISOLANTE ELETRICO","2035 - PLC, CONTROLADORES","2036 - INVERSORES DE FREQUENCIA",
  "2037 - CONVERSORES","2038 - BATERIAS/SOQUETE BATERIA","2039 - SOQUETES/REATORES",
  "2040 - CAPACITORES","2041 - PROCESSADORES","2042 - RELE",
  "2043 - CIRCUITOS INTEGRADOS - CI","2044 - MICROCONTROLADORES","2045 - BOMBAS",
  "2046 - MICROFONE","2047 - AMPLIFICADOR","2048 - ATUADORES","2049 - FOTOACOPLADORES",
  "2050 - ESTABILIZADORES","2051 - SWITCH/HUB","2052 - WIRELESS ANTENAS/ROTEADORES",
  "2053 - CAMERAS","2054 - INDUTORES, BOBINAS","2055 - CRYSTAL, OSCILADORES",
  "2056 - DISSIPADOR TERM./TERMISTOR","2057 - AR CONDICIONADO","2058 - TERMISTORES",
  "2059 - CHICOTES DE CABOS SPECTRUM","2060 - GERADOR DE ENERGIA","2061 - PAINEIS ELETRICOS",
  "2062 - CINTILADORES",
  "21 - M.P MATERIAL MECANICO",
  "2101 - ABRACADEIRA/PRESILHA","2102 - PREGOS","2103 - ARRUELAS","2104 - PARAFUSOS",
  "2105 - CANALETAS","2106 - PORCAS","2107 - ROLETES","2108 - RODIZIOS",
  "2109 - CORRENTES/EMENDAS CORRENTES","2110 - PES","2111 - GUIAS","2112 - FUSOS",
  "2113 - ACRILICOS","2114 - MANGUEIRAS","2115 - ROLAMENTOS","2116 - CHUMBO",
  "2117 - METALON","2118 - CHAPAS","2119 - TARUGOS","2120 - CANTONEIRAS",
  "2121 - AMORTECEDORES/COXIM","2122 - FECHADURAS","2123 - PECAS DMC PROJETO VMI",
  "2124 - ACOPLAMENTOS","2125 - PRENSA CABOS","2126 - GAXETAS","2127 - GRAMPOS",
  "2128 - PASSA CABO","2129 - PUXADORES","2130 - RACKS","2131 - CHASSI","2132 - CASE",
  "2133 - REBITE","2134 - COLIMADORES","2135 - PLATAFORMAS","2136 - CORTINA EM GERAL",
  "2137 - CORREIAS","2138 - MOLAS","2139 - ISOLANTE TERMICO","2140 - PARA RAIOS",
  "2141 - TUBO","2142 - VIGAS","2143 - OLHAL","2144 - ANEL DE RETENCAO",
  "2145 - GANCHOS","2146 - PEDESTAIS","2147 - POLIMEROS","2148 - PECAS USINADAS",
  "2149 - MATERIAL PARA ACABAMENTO","2150 - REDUTOR","2151 - ESFERAS",
  "22 - MATERIAL SUPORTE",
  "2201 - DOBRADICAS","2202 - LUBRIFICANTES","2203 - PALETES/TAMPAS/CAIXAS",
  "2204 - MANUAIS/CATALOGOS","2205 - ADESIVOS/PLACAS/ETIQUETAS","2206 - SOFTWARES",
  "2207 - BANDEJAS/RECIPIENTES","2208 - VEICULOS","2209 - LIQUIDOS/GASES/COMPOSTOS",
  "2210 - FIXADORES","2211 - CHAVES","2212 - JUNTAS","2213 - MATERIAL PARA OBRA CIVIL",
  "2214 - BARRAMENTO","2215 - VALVULAS","2216 - TINTAS","2217 - FIRMWARE","2218 - VIDRO",
  "2219 - SOLDA/ELETRODO/ESTANHO","2220 - FILTROS MECANICOS",
  "23 - EXPEDIENTE | GASTOS GERAIS",
  "2301 - CARTUCHOS/TONNERS","2302 - CD/DVD/DISQUETE","2303 - MOUSES","2304 - PEN DRIVES",
  "2305 - MATERIAL DE ESCRITORIO","2306 - MATERIAL DE LIMPEZA","2307 - EXTENSOES ELETRICAS",
  "2308 - PRODUTOS ALIMENTICIOS","2309 - ITENS PARA FESTAS/PRESENTES","2310 - DRIVES",
  "2311 - MATERIAL PROMOCIONAL","2312 - NORMAS","2313 - MATERIAL PARA SUPORTE",
  "2314 - COMBUSTIVEL","2315 - MATERIAL DE REFEITORIO","2316 - CELULAR",
  "2317 - PROJETOS ENG.PRODUTO IA","2318 - BORRACHA",
  "24 - M.C MATERIAL IMOBILIZADO",
  "2401 - FERRAMENTAS","2402 - MAQUINAS E EQUIPAMENTOS","2403 - INSTRUMENTOS MEDICAO",
  "2404 - PRODUTOS DE INFRAESTRUTURA","2405 - KIT DE DESENVOLVIMENTO ELETRON",
  "25 - M.C MATERIAL DE SEG.TRABALHO",
  "2501 - CALCADOS","2502 - CAMISAS","2503 - CALCAS","2504 - LUVAS EM GERAL",
  "2505 - CREME/BLOQUEADOR","2506 - CAPAS/COLETES","2507 - MASCARAS EPI",
  "2508 - PROTETOR AURICULAR","2509 - MACACAO EPI","2510 - KIT PRIMEIROS SOCORROS",
  "2511 - CAPACETE/BONE","2512 - FITA/CORRENTE DE SEG./CONE","2513 - EXTINTOR",
  "2514 - OCULOS","2515 - PROTETORES","2516 - COMPLEMENTOS DE UNIFORME",
  "26 - PA - MR",
  "2601 - DETECTOR DE METAL","2602 - DETECTOR TR2000","2603 - SCANNER CX5030",
  "2604 - SCANNER CX6040","2605 - SCANNER CX100100","2606 - SCANNER FS6000",
  "2607 - SCANNER BI2002","2608 - SCANNER CX150180","2609 - SCANNER CX180180",
  "2610 - SCANNER MX9080","2611 - SCANNER MT1213","2612 - SCANNER XIS1818",
  "2613 - SCANNER FEP","2614 - SCANNER HI SCAN","2615 - CFTV/CAMERA/DVR E DERIVADOS",
  "2616 - CONTROLE DE ACESSO","2617 - RASTREADORES VEICULARES","2618 - FLATSCAN",
  "2619 - SPECTRUM DETECTOR DE RADIACAO","2620 - SPECTRUM 5333","2621 - SPECTRUM 6040",
  "2622 - SPECTRUM 100100","2623 - SPECTRUM 150180","2624 - SPECTRUM 180180",
  "2625 - SPECTRUM CARGO","2626 - SPECTRUM BODY SCAN","2627 - SPECTRUM MOBILE SCAN 100100",
  "2628 - SPECTRUM OCR","2629 - ALARMES - SEGURANCA","2630 - BODY SCAN CANON",
  "2631 - SCANNER RAPISCAN REFLEXION","2632 - SPECTRUM 5536","2633 - SCANNER B-SCAN",
  "2634 - SPECTRUM 7560","2635 - SPECTRUM 6550","2636 - CABINE DE INSPECAO",
  "2637 - ACESSORIOS RAIO-X","2638 - SMART CHECK","2639 - SPECTRUM 6575",
  "2640 - SCANNER RAPISCAN 920","2641 - SCANNER VIDERAY","2642 - SCANNER XIS 5335 S",
  "2643 - SCANNER XIS 6040","2644 - SCANNER PORTATIL","2645 - SCANNER EXPLOSIVOS/NARCOTICOS",
  "2646 - SCANNER SMTHIS","2647 - SCANNER SPECTRUM RECYCLING",
  "27 - PRODUTOS INTERMEDIARIOS",
  "2701 - SUBCONJUNTOS MECANICOS","2702 - SUBCONJUNTOS ELETRONICOS",
  "2703 - SUBCONJUNTOS ALTA ENERGIA","2704 - SUBCONJUNTOS BAIXA ENERGIA",
  "2705 - SUBCONJUNTOS SEG.ELETRONICA","2706 - SUBCONJUNTOS DETECTORES METAL",
  "2707 - CONJUNTO RASTREAVEL POR N/S","2708 - CONJUNTO ELETROMECANICO",
  "2709 - CONJUNTO ACABAMENTO","2710 - CONJUNTO ACESSORIOS","2711 - CONJUNTO EMBALAGENS",
  "2712 - SPARE PART","2713 - SUBCONJUNTOS PA'S","2714 - ITENS DESMONTADOS PCP",
  "2715 - EXCLUSIVIDADE PECAS COMERCIAL",
  "28 - SERVICOS PRESTADOS",
  "2801 - PECAS E SERVICOS P/ MANUTENCAO","2802 - OPERACAO","2803 - LOCACAO",
  "2804 - INSTALACAO","2805 - TREINAMENTOS","2806 - SERVICOS PRESTADOS",
  "2807 - CADASTROS CONTRATOS ASS.TEC","2808 - CADASTROS CONTRATOS COMERCIAL",
  "2899 - INSPECAO TECNICA INTERNA",
  "29 - SERVICOS TOMADOS","2901 - SERVICOS TOMADOS",
  "30 - PRODUTOS REMANUFATURADO",
  "3001 - REMANUFATURADO BAIXA ENERGIA","3002 - REMANUFATURADO CFTV",
  "31 - MATERIAL DE RESIDUO","3101 - SUCATA","3102 - GRUPOS BLOQUEADOS",
  "33 - CONJUNTOS E PECAS MECANICAS",
  "3301 - 5020","3302 - 5333","3303 - 6040 SV/DV/M","3304 - 5536","3305 - 6550",
  "3306 - 7550","3307 - 100100 VAN","3308 - 100100 H","3309 - 100100 M",
  "3310 - 150180","3311 - 180180","3312 - BODYSCAN","3313 - FLATSCAN SV",
  "3314 - FLATSCAN DV","3315 - CARGO","3316 - CARGO COMPACT","3317 - SMART LANE",
  "3318 - BODYSCAN MOVEL","3319 - FS 6000","3320 - 100100 SV/DV","3321 - 6575",
  "3322 - SMART CHECK","3323 - 6040 LOW COST","3327 - (SEM DESCRICAO)",
  "3328 - 4SPEC","3329 - ORESPECTRA","3330 - ARCELOR MITTAL",
  "3331 - SPECTRUM RECYCLING","3333 - CARGO MOVEL","3334 - BODYSCAN VERTICAL",
  "3341 - SPECTRUM 100100 TROLLEY","3394 - DISPOSITIVOS PARA PROCESSOS",
  "3395 - EMBALAGENS","3396 - ACESSORIOS","3397 - PHANTOM",
  "3399 - ARQUIVO PADRAO EQUIPAMENTOS",
  "34 - ACESSORIOS",
  "3401 - TOTEM","3402 - MESAS ROLETES","3403 - EXTENSOR TUNEL","3404 - GERADOR RX",
  "3405 - SISTEMA DE RETORNO DE BANDEJAS","3406 - TECLADOS",
  "3407 - MESA DE OLEO PARA GERADOR RX","3408 - MESA MOVEL PARA TOTEM",
  "3409 - APARELHO DE IRRADIACAO UV-C","3410 - ESTEIRA MOTORIZADA","3411 - BIOMBO",
  "3412 - CABINE BODYSCAN","3413 - DETECTORAS VMIS","3414 - RAMPAS","3415 - BALANCA",
  "3417 - ARCO DE LEITURA","3418 - SUPORTE PARA TECLADO","3420 - GUARD RAIL",
  "3421 - SUPORTE PARA CAMERA","3422 - SISTEMA DE FIXA CADEIRA E MESA",
  "3441 - ACESSORIOS 100100 TROLLEY","3499 - ARQUIVO PADRAO ACESSORIOS",
  "3502 - 5030","3503 - 6040 SV/DV/M/P3D","3504 - 5536","3506 - 7560","3523 - 6040 LOW COST/SV",
  "98 - UNIDADE SERVICO","9801 - UNIDADE SERVICO",
  "99 - UNIDADE CONSUMO","9901 - UNIDADE CONSUMO",
  "MOD_ - MAO DE OBRA PRODUCAO",
];

// ── SIGLAS (campo Tipo renomeado) ─────────────────────────────────
const SIGLAS = [
  { value:"PI", label:"PI (Produto Intermediário)" },
  { value:"PA", label:"PA (Produto Acabado)" },
  { value:"MP", label:"MP (Matéria-Prima)" },
  { value:"AI", label:"AI (Ativo Imobilizado)" },
  { value:"MR", label:"MR (Material de Revenda)" },
  { value:"SV", label:"SV (Serviço)" },
  { value:"MC", label:"MC (Material de Consumo)" },
  { value:"EX", label:"EX (Material de Expediente)" },
];

// ── SETORES DA EMPRESA (campo "Setor Solicitante") ───────────────
const SETORES_EMPRESA = [
  "Almoxarifado","Assistência Técnica","Compras","Contabilidade","Controladoria",
  "Engenharia de Produto","Engenharia de Processos","Engenharia de Qualidade",
  "Expedição","Financeiro","Fiscal","Importação","Jurídico","Logística",
  "Manutenção","Marketing","PCP","Produção","Projetos","Qualidade",
  "Recursos Humanos","Segurança do Trabalho","Suprimentos","TI","Vendas","Outros",
];

// ── GRUPOS PROTHEUS — somente subgrupos de 4 dígitos ─────────────
const GRUPOS_PROTHEUS_ITENS = [
  "2001 - CONECTORES/BORNES","2002 - CONTATORES/DISJUNTORES/BOTOES","2003 - FONTES",
  "2004 - SENSORES","2005 - GERADOR/TUBOS DE RAIOS-X","2006 - ACELERADORES",
  "2007 - NO-BREAK","2008 - PLACAS ELETRONICAS - PCI'S","2009 - DETECTORES RAIOS-X",
  "2010 - CPU, COMPUTADOR, NOTEBOOK","2011 - CABOS","2012 - DISCOS RIGIDOS",
  "2013 - TERMINAIS","2014 - MOTORES","2015 - FILTROS","2016 - RESISTORES",
  "2017 - FUSIVEIS","2018 - TRANSFORMADORES","2019 - MONITORES",
  "2020 - LAMPADAS/LEDS/LUMINARIAS ETC","2021 - LENTES","2022 - INTERRUPTORES/COMUTADORES",
  "2023 - TECLADOS","2024 - HD/PEN DRIVE/C.MEMORIA ETC","2025 - COOLER/MICRO-VENTILADOR",
  "2026 - DIODOS","2027 - SINALIZADORES - INDICADORES","2028 - RETIFICADORES",
  "2029 - TRANSISTORES","2030 - DISPOSITIVOS PARADA DE EMERGENCIA",
  "2031 - CONDENSADORA","2032 - EVAPORADORA","2033 - CONTROLE REMOTO",
  "2034 - ISOLANTE ELETRICO","2035 - PLC, CONTROLADORES","2036 - INVERSORES DE FREQUENCIA",
  "2037 - CONVERSORES","2038 - BATERIAS/SOQUETE BATERIA","2039 - SOQUETES/REATORES",
  "2040 - CAPACITORES","2041 - PROCESSADORES","2042 - RELE",
  "2043 - CIRCUITOS INTEGRADOS - CI","2044 - MICROCONTROLADORES","2045 - BOMBAS",
  "2046 - MICROFONE","2047 - AMPLIFICADOR","2048 - ATUADORES","2049 - FOTOACOPLADORES",
  "2050 - ESTABILIZADORES","2051 - SWITCH/HUB","2052 - WIRELESS ANTENAS/ROTEADORES",
  "2053 - CAMERAS","2054 - INDUTORES, BOBINAS","2055 - CRYSTAL, OSCILADORES",
  "2056 - DISSIPADOR TERM./TERMISTOR","2057 - AR CONDICIONADO","2058 - TERMISTORES",
  "2059 - CHICOTES DE CABOS SPECTRUM","2060 - GERADOR DE ENERGIA",
  "2061 - PAINEIS ELETRICOS","2062 - CINTILADORES",
  "2101 - ABRACADEIRA/PRESILHA","2102 - PREGOS","2103 - ARRUELAS","2104 - PARAFUSOS",
  "2105 - CANALETAS","2106 - PORCAS","2107 - ROLETES","2108 - RODIZIOS",
  "2109 - CORRENTES/EMENDAS CORRENTES","2110 - PES","2111 - GUIAS","2112 - FUSOS",
  "2113 - ACRILICOS","2114 - MANGUEIRAS","2115 - ROLAMENTOS","2116 - CHUMBO",
  "2117 - METALON","2118 - CHAPAS","2119 - TARUGOS","2120 - CANTONEIRAS",
  "2121 - AMORTECEDORES/COXIM","2122 - FECHADURAS","2123 - PECAS DMC PROJETO VMI",
  "2124 - ACOPLAMENTOS","2125 - PRENSA CABOS","2126 - GAXETAS","2127 - GRAMPOS",
  "2128 - PASSA CABO","2129 - PUXADORES","2130 - RACKS","2131 - CHASSI","2132 - CASE",
  "2133 - REBITE","2134 - COLIMADORES","2135 - PLATAFORMAS","2136 - CORTINA EM GERAL",
  "2137 - CORREIAS","2138 - MOLAS","2139 - ISOLANTE TERMICO","2140 - PARA RAIOS",
  "2141 - TUBO","2142 - VIGAS","2143 - OLHAL","2144 - ANEL DE RETENCAO",
  "2145 - GANCHOS","2146 - PEDESTAIS","2147 - POLIMEROS","2148 - PECAS USINADAS",
  "2149 - MATERIAL PARA ACABAMENTO","2150 - REDUTOR","2151 - ESFERAS",
  "2201 - DOBRADICAS","2202 - LUBRIFICANTES","2203 - PALETES/TAMPAS/CAIXAS",
  "2204 - MANUAIS/CATALOGOS","2205 - ADESIVOS/PLACAS/ETIQUETAS","2206 - SOFTWARES",
  "2207 - BANDEJAS/RECIPIENTES","2208 - VEICULOS","2209 - LIQUIDOS/GASES/COMPOSTOS",
  "2210 - FIXADORES","2211 - CHAVES","2212 - JUNTAS","2213 - MATERIAL PARA OBRA CIVIL",
  "2214 - BARRAMENTO","2215 - VALVULAS","2216 - TINTAS","2217 - FIRMWARE",
  "2218 - VIDRO","2219 - SOLDA/ELETRODO/ESTANHO","2220 - FILTROS MECANICOS",
  "2301 - CARTUCHOS/TONNERS","2302 - CD/DVD/DISQUETE","2303 - MOUSES","2304 - PEN DRIVES",
  "2305 - MATERIAL DE ESCRITORIO","2306 - MATERIAL DE LIMPEZA","2307 - EXTENSOES ELETRICAS",
  "2308 - PRODUTOS ALIMENTICIOS","2309 - ITENS PARA FESTAS/PRESENTES","2310 - DRIVES",
  "2311 - MATERIAL PROMOCIONAL","2312 - NORMAS","2313 - MATERIAL PARA SUPORTE",
  "2314 - COMBUSTIVEL","2315 - MATERIAL DE REFEITORIO","2316 - CELULAR",
  "2317 - PROJETOS ENG.PRODUTO IA","2318 - BORRACHA",
  "2401 - FERRAMENTAS","2402 - MAQUINAS E EQUIPAMENTOS","2403 - INSTRUMENTOS MEDICAO",
  "2404 - PRODUTOS DE INFRAESTRUTURA","2405 - KIT DE DESENVOLVIMENTO ELETRON",
  "2501 - CALCADOS","2502 - CAMISAS","2503 - CALCAS","2504 - LUVAS EM GERAL",
  "2505 - CREME/BLOQUEADOR","2506 - CAPAS/COLETES","2507 - MASCARAS EPI",
  "2508 - PROTETOR AURICULAR","2509 - MACACAO EPI","2510 - KIT PRIMEIROS SOCORROS",
  "2511 - CAPACETE/BONE","2512 - FITA/CORRENTE DE SEG./CONE","2513 - EXTINTOR",
  "2514 - OCULOS","2515 - PROTETORES","2516 - COMPLEMENTOS DE UNIFORME",
  "2601 - DETECTOR DE METAL","2602 - DETECTOR TR2000","2603 - SCANNER CX5030",
  "2604 - SCANNER CX6040","2605 - SCANNER CX100100","2606 - SCANNER FS6000",
  "2607 - SCANNER BI2002","2608 - SCANNER CX150180","2609 - SCANNER CX180180",
  "2610 - SCANNER MX9080","2611 - SCANNER MT1213","2612 - SCANNER XIS1818",
  "2613 - SCANNER FEP","2614 - SCANNER HI SCAN","2615 - CFTV/CAMERA/DVR E DERIVADOS",
  "2616 - CONTROLE DE ACESSO","2617 - RASTREADORES VEICULARES","2618 - FLATSCAN",
  "2619 - SPECTRUM DETECTOR DE RADIACAO","2620 - SPECTRUM 5333","2621 - SPECTRUM 6040",
  "2622 - SPECTRUM 100100","2623 - SPECTRUM 150180","2624 - SPECTRUM 180180",
  "2625 - SPECTRUM CARGO","2626 - SPECTRUM BODY SCAN","2627 - SPECTRUM MOBILE SCAN 100100",
  "2628 - SPECTRUM OCR","2629 - ALARMES - SEGURANCA","2630 - BODY SCAN CANON",
  "2631 - SCANNER RAPISCAN REFLEXION","2632 - SPECTRUM 5536","2633 - SCANNER B-SCAN",
  "2634 - SPECTRUM 7560","2635 - SPECTRUM 6550","2636 - CABINE DE INSPECAO",
  "2637 - ACESSORIOS RAIO-X","2638 - SMART CHECK","2639 - SPECTRUM 6575",
  "2640 - SCANNER RAPISCAN 920","2641 - SCANNER VIDERAY","2642 - SCANNER XIS 5335 S",
  "2643 - SCANNER XIS 6040","2644 - SCANNER PORTATIL","2645 - SCANNER EXPLOSIVOS/NARCOTICOS",
  "2646 - SCANNER SMTHIS","2647 - SCANNER SPECTRUM RECYCLING",
  "2701 - SUBCONJUNTOS MECANICOS","2702 - SUBCONJUNTOS ELETRONICOS",
  "2703 - SUBCONJUNTOS ALTA ENERGIA","2704 - SUBCONJUNTOS BAIXA ENERGIA",
  "2705 - SUBCONJUNTOS SEG.ELETRONICA","2706 - SUBCONJUNTOS DETECTORES METAL",
  "2707 - CONJUNTO RASTREAVEL POR N/S","2708 - CONJUNTO ELETROMECANICO",
  "2709 - CONJUNTO ACABAMENTO","2710 - CONJUNTO ACESSORIOS","2711 - CONJUNTO EMBALAGENS",
  "2712 - SPARE PART","2713 - SUBCONJUNTOS PA'S","2714 - ITENS DESMONTADOS PCP",
  "2715 - EXCLUSIVIDADE PECAS COMERCIAL",
  "2801 - PECAS E SERVICOS P/ MANUTENCAO","2802 - OPERACAO","2803 - LOCACAO",
  "2804 - INSTALACAO","2805 - TREINAMENTOS","2806 - SERVICOS PRESTADOS",
  "2807 - CADASTROS CONTRATOS ASS.TEC","2808 - CADASTROS CONTRATOS COMERCIAL",
  "2899 - INSPECAO TECNICA INTERNA",
  "2901 - SERVICOS TOMADOS",
  "3001 - REMANUFATURADO BAIXA ENERGIA","3002 - REMANUFATURADO CFTV",
  "3101 - SUCATA","3102 - GRUPOS BLOQUEADOS",
  "3301 - 5020","3302 - 5333","3303 - 6040 SV/DV/M","3304 - 5536","3305 - 6550",
  "3306 - 7550","3307 - 100100 VAN","3308 - 100100 H","3309 - 100100 M",
  "3310 - 150180","3311 - 180180","3312 - BODYSCAN","3313 - FLATSCAN SV",
  "3314 - FLATSCAN DV","3315 - CARGO","3316 - CARGO COMPACT","3317 - SMART LANE",
  "3318 - BODYSCAN MOVEL","3319 - FS 6000","3320 - 100100 SV/DV","3321 - 6575",
  "3322 - SMART CHECK","3323 - 6040 LOW COST","3327 - (SEM DESCRICAO)",
  "3328 - 4SPEC","3329 - ORESPECTRA","3330 - ARCELOR MITTAL",
  "3331 - SPECTRUM RECYCLING","3333 - CARGO MOVEL","3334 - BODYSCAN VERTICAL",
  "3341 - SPECTRUM 100100 TROLLEY","3394 - DISPOSITIVOS PARA PROCESSOS",
  "3395 - EMBALAGENS","3396 - ACESSORIOS","3397 - PHANTOM",
  "3399 - ARQUIVO PADRAO EQUIPAMENTOS",
  "3401 - TOTEM","3402 - MESAS ROLETES","3403 - EXTENSOR TUNEL","3404 - GERADOR RX",
  "3405 - SISTEMA DE RETORNO DE BANDEJAS","3406 - TECLADOS",
  "3407 - MESA DE OLEO PARA GERADOR RX","3408 - MESA MOVEL PARA TOTEM",
  "3409 - APARELHO DE IRRADIACAO UV-C","3410 - ESTEIRA MOTORIZADA","3411 - BIOMBO",
  "3412 - CABINE BODYSCAN","3413 - DETECTORAS VMIS","3414 - RAMPAS","3415 - BALANCA",
  "3417 - ARCO DE LEITURA","3418 - SUPORTE PARA TECLADO","3420 - GUARD RAIL",
  "3421 - SUPORTE PARA CAMERA","3422 - SISTEMA DE FIXA CADEIRA E MESA",
  "3441 - ACESSORIOS 100100 TROLLEY","3499 - ARQUIVO PADRAO ACESSORIOS",
  "3502 - 5030","3503 - 6040 SV/DV/M/P3D","3504 - 5536","3506 - 7560","3523 - 6040 LOW COST/SV",
  "9801 - UNIDADE SERVICO",
  "9901 - UNIDADE CONSUMO",
];

// ══════════════════════════════════════════════════════════════════
// SUPABASE API
// ══════════════════════════════════════════════════════════════════
function sbHeaders() {
  return {
    "apikey": CONFIG.SUPABASE_ANON_KEY,
    "Authorization": `Bearer ${CONFIG.SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
    "Prefer": "return=representation",
  };
}
const sbUrl = (path: string) => `${CONFIG.SUPABASE_URL}/rest/v1/${path}`;
const isConfigured = () => CONFIG.SUPABASE_URL.startsWith("https://") && CONFIG.SUPABASE_ANON_KEY.length > 50;

async function fetchSolicitacoes() {
  const r = await fetch(sbUrl("solicitacoes?select=*&order=created_at.desc"), { headers: sbHeaders() });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
async function insertSolicitacao(data: any) {
  const r = await fetch(sbUrl("solicitacoes"), { method:"POST", headers:sbHeaders(), body:JSON.stringify(data) });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
async function updateSolicitacao(id: string, data: any) {
  const r = await fetch(sbUrl(`solicitacoes?id=eq.${id}`), { method:"PATCH", headers:sbHeaders(), body:JSON.stringify(data) });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
async function deleteSolicitacao(id: string) {
  const r = await fetch(sbUrl(`solicitacoes?id=eq.${id}`), { method:"DELETE", headers:sbHeaders() });
  if (!r.ok) throw new Error(await r.text());
}
async function fetchHistorico(solId: string) {
  const r = await fetch(sbUrl(`historico?solicitacao_id=eq.${solId}&order=created_at.asc`), { headers: sbHeaders() });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
async function insertHistorico(data: any) {
  await fetch(sbUrl("historico"), { method:"POST", headers:sbHeaders(), body:JSON.stringify(data) });
}
async function fetchSolicitantesDB() {
  const r = await fetch(sbUrl("solicitantes?select=*&order=nome.asc"), { headers: sbHeaders() });
  if (!r.ok) return [];
  return r.json();
}
async function insertSolicitante(nome: string) {
  const r = await fetch(sbUrl("solicitantes"), { method:"POST", headers:sbHeaders(), body:JSON.stringify({ nome }) });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

// ── GOOGLE SHEETS ─────────────────────────────────────────────────
function parseCSVRow(row: string) {
  const cols: string[] = [];
  let cur = "", inQ = false;
  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (ch === '"') { inQ = !inQ; continue; }
    if (ch === ',' && !inQ) { cols.push(cur.trim()); cur = ""; continue; }
    cur += ch;
  }
  cols.push(cur.trim());
  return cols;
}
async function fetchPlanilha() {
  if (!CONFIG.GOOGLE_SHEET_ID) return [];
  try {
    const url = `https://docs.google.com/spreadsheets/d/${CONFIG.GOOGLE_SHEET_ID}/export?format=csv&gid=0`;
    const r = await fetch(url);
    if (!r.ok) return [];
    const text = await r.text();
    return text.split("\n").slice(1, 330).map(row => {
      const cols = parseCSVRow(row);
      return { codigo:(cols[0]||"").trim(), descricao:(cols[1]||"").trim(), grupo:(cols[2]||"").trim() };
    }).filter((r: any) => r.codigo && r.descricao);
  } catch { return []; }
}

// ── UTILITÁRIOS ────────────────────────────────────────────────────
function calcSLA(createdAt: string) {
  if (!createdAt) return 0;
  return Math.round((Date.now() - new Date(createdAt).getTime()) / 3600000);
}
function slaColor(h: number) { return h >= 48 ? C.red : h >= 36 ? C.orange : C.green; }
function genNumero() { return `SOL-${Math.floor(1000 + Math.random() * 8999)}`; }
function fmtDate(d: string) {
  if (!d) return "—";
  return new Date(d).toLocaleString("pt-BR", { day:"2-digit", month:"2-digit", hour:"2-digit", minute:"2-digit" });
}

// ── ABREVIAÇÕES AUTOMÁTICAS ────────────────────────────────────────
function applyAbbreviations(text: string): string {
  return text
    .replace(/\b(\d+)\s*milímetros?\b/gi, "$1MM")
    .replace(/\b(\d+)\s*mm\b/gi, "$1MM")
    .replace(/\b(\d+)\s*polegadas?\b/gi, "$1POL")
    .replace(/\b(\d+)\s*"\s*/g, "$1POL ")
    .replace(/\b(\d+)\s*pol\b/gi, "$1POL")
    .replace(/\bquilogramas?\b/gi, "KG")
    .replace(/\bkilogramas?\b/gi, "KG")
    .replace(/\blitros?\b/gi, "LT")
    .replace(/\bunidades?\b/gi, "UN")
    .replace(/\bcentímetros?\b/gi, "CM")
    .replace(/\bmetros?\b/gi, "MT")
    .replace(/\bzincado\b/gi, "ZINC")
    .replace(/\bniquelado\b/gi, "NIQ")
    .replace(/\binox\b/gi, "INOX")
    .replace(/\baço\b/gi, "ACO")
    .replace(/\balumínio\b/gi, "ALU")
    .trim().toUpperCase();
}

// ── EXPORTAR XLSX ─────────────────────────────────────────────────
// Converte array de arrays em XML de planilha Excel (.xls via XML Spreadsheet 2003)
function buildXmlXlsx(headers: string[], rows: string[][]): string {
  const esc = (v: string) => String(v||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  const cell = (v: string, isH=false) => `<Cell${isH?' ss:StyleID="h"':''}><Data ss:Type="String">${esc(v)}</Data></Cell>`;
  const hRow = `<Row>${headers.map(h=>cell(h,true)).join("")}</Row>`;
  const dRows = rows.map(r=>`<Row>${r.map(v=>cell(v)).join("")}</Row>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Styles><Style ss:ID="h"><Font ss:Bold="1"/></Style></Styles><Worksheet ss:Name="MDM"><Table>${hRow}\n${dRows}</Table></Worksheet></Workbook>`;
}
function downloadXlsx(xml: string, filename: string) {
  try {
    // Try Blob first (desktop)
    const blob = new Blob([xml], { type:"application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    setTimeout(()=>{ document.body.removeChild(a); URL.revokeObjectURL(url); }, 500);
  } catch {
    // Fallback: data URI (mobile Safari)
    const b64 = btoa(unescape(encodeURIComponent(xml)));
    const a = document.createElement("a");
    a.href = "data:application/vnd.ms-excel;base64," + b64;
    a.download = filename; a.click();
  }
}
function exportXLSX(sols: any[]) {
  const headers = [
    "Número","Status","Solicitante","Setor","Produto","Tipo","Unidade",
    "NCM","Grupo Protheus","Armazém","Custo Est.","Urgente","Motivo Urgência",
    "Kanban","Importado","Protótipo","Control SCF","Chumbo/RoHS",
    "Cod. Mecânico","Descrição Técnica","Observações","Total Itens","Criado em"
  ];
  const rows = sols.map(s => [
    s.numero||"", s.status||"", s.solicitante||"", s.setor||"",
    s.descricao||"", s.tipo||"", s.unidade||"", s.ncm||"",
    s.grupo||"", s.armazem||"", s.custo!=null?String(s.custo):"",
    s.urgente?"Sim":"Não", s.motivo_urgencia||"",
    s.kanban?"Sim":"Não", s.importado?"Sim":"Não",
    s.prototipo?"Sim":"Não", s.control_scf?"Sim":"Não",
    s.chumbo?"Sim":"Não", s.cod_mecanico||"",
    s.desc_detalhada||"", s.observacoes||"",
    String(s.total_itens||1), fmtDate(s.created_at),
  ]);
  // Nome do arquivo: SOLICITACAO_NOME.xls ou data
  const nome = sols.length===1 && sols[0].solicitante
    ? `SOLICITACAO_${sols[0].solicitante.toUpperCase().replace(/\s+/g,"_")}.xls`
    : `SOLICITACOES_MDM_${new Date().toISOString().slice(0,10)}.xls`;
  const xml = buildXmlXlsx(headers, rows);
  downloadXlsx(xml, nome);
}
function exportSingleXLSX(sol: any) {
  exportXLSX([sol]);
}

// ══════════════════════════════════════════════════════════════════
// ÍCONES SVG
// ══════════════════════════════════════════════════════════════════
const ICONS: Record<string,string> = {
  dashboard:`<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>`,
  plus:`<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>`,
  list:`<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3" cy="6" r="1" fill="currentColor"/><circle cx="3" cy="12" r="1" fill="currentColor"/><circle cx="3" cy="18" r="1" fill="currentColor"/>`,
  chart:`<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>`,
  check:`<polyline points="20 6 9 17 4 12"/>`,
  alert:`<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="1" fill="currentColor"/>`,
  clock:`<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>`,
  box:`<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>`,
  settings:`<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>`,
  file:`<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>`,
  arrow:`<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>`,
  back:`<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>`,
  upload:`<polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>`,
  search:`<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>`,
  tag:`<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>`,
  send:`<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>`,
  x:`<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>`,
  refresh:`<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>`,
  edit:`<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>`,
  user:`<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`,
  users:`<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
  trash:`<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>`,
  lock:`<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>`,
  download:`<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>`,
  chevron_down:`<polyline points="6 9 12 15 18 9"/>`,
  chevron_up:`<polyline points="18 15 12 9 6 15"/>`,
  wrench:`<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>`,
  zap:`<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`,
};
function Icon({ name, size=16, color="currentColor" }: {name:string,size?:number,color?:string}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: ICONS[name]||"" }}/>;
}

// ══════════════════════════════════════════════════════════════════
// COMPONENTES BASE
// ══════════════════════════════════════════════════════════════════
function StatusTag({ status }: {status:string}) {
  const cfg = STATUS_CFG[status] || { c:"#505B72", bg:"#50607215" };
  return <span style={{ background:cfg.bg, color:cfg.c, border:`1px solid ${cfg.c}40`, borderRadius:4, fontSize:10, fontWeight:700, padding:"2px 8px", letterSpacing:0.6, textTransform:"uppercase", whiteSpace:"nowrap" }}>{status}</span>;
}
function PrioTag({ label }: {label:string}) {
  const m: Record<string,{c:string,bg:string}> = { Urgente:{c:C.red,bg:C.redDim}, Alta:{c:C.orange,bg:C.orangeDim} };
  const cfg = m[label]||{c:C.textMuted,bg:"#50607215"};
  return <span style={{ background:cfg.bg, color:cfg.c, border:`1px solid ${cfg.c}40`, borderRadius:4, fontSize:10, fontWeight:700, padding:"2px 8px", letterSpacing:0.6, textTransform:"uppercase" }}>{label}</span>;
}
function Card({ children, style={} }: {children:any,style?:any}) {
  return <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, boxShadow:"0 2px 12px rgba(0,0,0,.25)", ...style }}>{children}</div>;
}
const iS: any = {
  background:"#0C0F16", border:`1px solid ${C.border}`, borderRadius:6,
  color:C.text, fontSize:13, padding:"10px 13px", outline:"none",
  fontFamily:"'IBM Plex Sans',sans-serif", resize:"none", width:"100%", boxSizing:"border-box" as any,
  transition:"border-color .15s, box-shadow .15s",
};

// ── SEARCHABLE SELECT ──────────────────────────────────────────────
function SearchSelect({ label, value, onChange, options, placeholder="Buscar...", required }: any) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  // Sem slice — mostra TODOS os resultados com scroll nativo
  const filtered = options.filter((o: string) => o.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:5 }} ref={ref}>
      <label style={{ fontSize:11, fontWeight:600, color:C.textSub, letterSpacing:0.5, textTransform:"uppercase" }}>
        {label}{required&&<span style={{ color:C.yellow, marginLeft:3 }}>*</span>}
      </label>
      <div style={{ position:"relative" }}>
        <div onClick={()=>setOpen(!open)} style={{ ...iS, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 13px" }}>
          <span style={{ color: value ? C.text : C.textMuted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{value || placeholder}</span>
          <Icon name={open?"chevron_up":"chevron_down"} size={14} color={C.textMuted}/>
        </div>
        {open && (
          <div style={{ position:"absolute", top:"calc(100% + 4px)", left:0, right:0, background:C.surfaceMid, border:`1px solid ${C.border}`, borderRadius:8, zIndex:200, boxShadow:"0 8px 24px rgba(0,0,0,.5)", display:"flex", flexDirection:"column", maxHeight:260 }}>
            <div style={{ padding:"8px 10px", borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
              <div style={{ position:"relative" }}>
                <div style={{ position:"absolute", left:9, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}><Icon name="search" size={12} color={C.textMuted}/></div>
                <input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Pesquisar..." style={{ ...iS, padding:"6px 8px 6px 28px", fontSize:12 }}/>
              </div>
            </div>
            <div ref={listRef} style={{ overflowY:"scroll", flex:1, WebkitOverflowScrolling:"touch" } as any}>
              {filtered.length === 0
                ? <div style={{ padding:"12px 14px", fontSize:12, color:C.textMuted }}>Nenhum resultado</div>
                : filtered.map((o: string) => (
                  <div key={o} onClick={()=>{onChange(o);setOpen(false);setQ("");}}
                    style={{ padding:"9px 14px", cursor:"pointer", fontSize:13, color:o===value?C.yellow:C.text, background:o===value?C.yellowDim:"transparent", transition:"background .1s", borderBottom:`1px solid ${C.border}20` }}
                    onMouseEnter={e=>{ if(o!==value) e.currentTarget.style.background=C.surfaceMid; }}
                    onMouseLeave={e=>{ e.currentTarget.style.background=o===value?C.yellowDim:"transparent"; }}>
                    {o}
                  </div>
                ))
              }
            </div>
            <div style={{ padding:"6px 12px", borderTop:`1px solid ${C.border}`, fontSize:10, color:C.textMuted, flexShrink:0 }}>
              {filtered.length} opção(ões)
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, type="text", placeholder="", value, onChange, required, options, maxLen }: any) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <label style={{ fontSize:11, fontWeight:600, color:C.textSub, letterSpacing:0.5, textTransform:"uppercase" }}>
          {label}{required&&<span style={{ color:C.yellow, marginLeft:3 }}>*</span>}
        </label>
        {maxLen&&<span style={{ fontSize:10, color:value?.length>maxLen-10?C.red:C.textMuted }}>{value?.length||0}/{maxLen}</span>}
      </div>
      {type==="textarea"
        ? <textarea rows={3} placeholder={placeholder} value={value} onChange={onChange} maxLength={maxLen} style={iS}/>
        : type==="select"
        ? <select value={value} onChange={onChange} style={{...iS,cursor:"pointer"}}>
            {placeholder&&<option value="">{placeholder}</option>}
            {(options||[]).map((o: any) => typeof o==="object"
              ? <option key={o.value} value={o.value}>{o.label}</option>
              : <option key={o}>{o}</option>
            )}
          </select>
        : <input type={type} placeholder={placeholder} value={value} onChange={onChange} maxLength={maxLen} style={iS}/>
      }
    </div>
  );
}

function Toggle({ label, value, onChange }: any) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
      <span style={{ fontSize:13, color:C.textSub }}>{label}</span>
      <div onClick={()=>onChange(!value)} style={{ width:38, height:22, borderRadius:11, cursor:"pointer", background:value?C.yellow:C.border, position:"relative", transition:"background 0.2s", flexShrink:0 }}>
        <div style={{ position:"absolute", top:3, left:value?19:3, width:16, height:16, borderRadius:"50%", background:"#fff", transition:"left 0.2s", boxShadow:"0 1px 4px rgba(0,0,0,.4)" }}/>
      </div>
    </div>
  );
}

function SecHead({ icon, title }: {icon:string,title:string}) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:9, paddingBottom:14, borderBottom:`1px solid ${C.border}`, marginBottom:20 }}>
      <div style={{ width:28, height:28, borderRadius:6, background:C.yellowDim, border:`1px solid ${C.yellowBorder}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <Icon name={icon} size={14} color={C.yellow}/>
      </div>
      <span style={{ fontWeight:700, fontSize:15, color:C.text }}>{title}</span>
    </div>
  );
}

function SLABar({ horas }: {horas:number}) {
  const pct = Math.min((horas/48)*100, 100);
  const col = slaColor(horas);
  return (
    <div style={{ width:80 }}>
      <div style={{ height:4, background:C.border, borderRadius:2, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${pct}%`, background:col, borderRadius:2, transition:"width .3s" }}/>
      </div>
      <span style={{ fontSize:9, color:col }}>{horas}h</span>
    </div>
  );
}

function Spinner({ size=18 }: {size?:number}) {
  return <div style={{ width:size, height:size, border:`2px solid ${C.border}`, borderTop:`2px solid ${C.yellow}`, borderRadius:"50%", animation:"spin 0.7s linear infinite" }}/>;
}

function Empty({ msg }: {msg:string}) {
  return (
    <div style={{ textAlign:"center", padding:"60px 20px", color:C.textMuted }}>
      <div style={{ opacity:.3, marginBottom:12 }}><Icon name="box" size={40} color={C.textMuted}/></div>
      <div style={{ fontSize:13 }}>{msg}</div>
    </div>
  );
}

// ── MODAL DE CONFIRMAÇÃO ──────────────────────────────────────────
function ConfirmModal({ msg, onConfirm, onCancel }: any) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, backdropFilter:"blur(4px)" }}>
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"28px 32px", maxWidth:400, width:"90%", boxShadow:"0 24px 64px rgba(0,0,0,.6)", animation:"fadeIn .15s ease" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
          <div style={{ width:36, height:36, borderRadius:8, background:C.redDim, border:`1px solid ${C.red}40`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="alert" size={18} color={C.red}/>
          </div>
          <span style={{ fontWeight:700, fontSize:15, color:C.text }}>Confirmar Ação</span>
        </div>
        <p style={{ color:C.textSub, fontSize:13, lineHeight:1.6, marginBottom:20 }}>{msg}</p>
        <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
          <button onClick={onCancel} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:6, color:C.textSub, fontSize:13, padding:"9px 20px", cursor:"pointer", fontFamily:"'IBM Plex Sans',sans-serif" }}>Cancelar</button>
          <button onClick={onConfirm} style={{ background:C.red, border:"none", borderRadius:6, color:"#fff", fontSize:13, fontWeight:700, padding:"9px 20px", cursor:"pointer", fontFamily:"'IBM Plex Sans',sans-serif" }}>Confirmar Exclusão</button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// CONSTRUTOR DE DESCRIÇÃO EXPANDIDO
// ══════════════════════════════════════════════════════════════════
const UNIDADES_DIM = ["MM","CM","M","POL","IN","KG","G","LT","ML","W","VA","A","V","HZ","RPM","°C"];

const DESC_TEMPLATES: Record<string,{fields:{name:string,opts?:string[],hasDim?:boolean}[],unit?:string}> = {
  // ── 20 ELETROELETRÔNICO ──────────────────────────────────────
  "Conector/Borne":     { fields:[{name:"Vias/Polos"},{name:"Passo",hasDim:true},{name:"Corrente/Tensão"},{name:"Material",opts:["PLASTICO","METAL","NYLON"]},{name:"Fixação",opts:["ENGATE RAPIDO","PARAFUSO","SOLDA","SMD"]}] },
  "Contator/Disjuntor": { fields:[{name:"Tipo",opts:["CONTATOR","DISJUNTOR","BOTAO","CHAVE","RELE TERMICO"]},{name:"Corrente",hasDim:true},{name:"Polos",opts:["1P","2P","3P","4P"]},{name:"Tensão",opts:["110V","220V","380V","24VDC","12VDC"]}] },
  "Fonte":              { fields:[{name:"Tipo",opts:["CHAVEADA","LINEAR","DC/DC","AC/DC","NOBREAK"]},{name:"Potência",hasDim:true},{name:"Tensão Entrada",opts:["110V","220V","110/220V","85-265V"]},{name:"Tensão Saída"},{name:"Corrente",hasDim:true}] },
  "Sensor":             { fields:[{name:"Tipo",opts:["INDUTIVO","CAPACITIVO","OPTICO","ULTRASONICO","TEMPERATURA","PRESSAO","CORRENTE","MAGNETICO"]},{name:"Alcance",hasDim:true},{name:"Tensão",opts:["5V","12V","24V","48V","220V"]},{name:"Saída",opts:["PNP","NPN","4-20MA","0-10V","DIGITAL","RS485"]},{name:"Fixação",opts:["ROSCA M8","ROSCA M12","ROSCA M18","ROSCA M30","FLANGE"]}] },
  "Gerador RX":         { fields:[{name:"Tipo",opts:["GERADOR","TUBO RX","FONTE RX"]},{name:"Potência",hasDim:true},{name:"kV",hasDim:true},{name:"Modelo"},{name:"Fabricante"}] },
  "No-Break":           { fields:[{name:"Potência VA",hasDim:true},{name:"Entrada",opts:["110V","220V","110/220V"]},{name:"Saída",opts:["110V","220V"]},{name:"Bateria",opts:["7AH","9AH","17AH","EXTERNA"]}] },
  "Placa PCI":          { fields:[{name:"Função"},{name:"Modelo"},{name:"Versão"},{name:"Interface",opts:["USB","RS232","RS485","ETHERNET","CAN","SPI","I2C","PROPRIETARY"]}] },
  "Detector RX":        { fields:[{name:"Tecnologia",opts:["CCD","CMOS","FLAT PANEL","SCINTILADOR"]},{name:"Dimensão",hasDim:true},{name:"Resolução"},{name:"Modelo"}] },
  "CPU/Computador":     { fields:[{name:"Tipo",opts:["CPU","NOTEBOOK","MINI PC","SBC","IPC"]},{name:"Processador"},{name:"Memória RAM",hasDim:true},{name:"Armazenamento",hasDim:true},{name:"Sistema",opts:["WINDOWS","LINUX","EMBARCADO"]}] },
  "Cabo":               { fields:[{name:"Tipo",opts:["FLEXIVEL","RIGIDO","COAXIAL","FLAT","BLINDADO","PAR TRANCADO","FIBRA OPTICA"]},{name:"Vias"},{name:"Bitola",hasDim:true},{name:"Comprimento",hasDim:true},{name:"Blindagem",opts:["BLINDADO","NAO BLINDADO"]}] },
 "Disco Rígido":        { fields:[{name:"Tipo",opts:["HDD","SSD","NVME","SD CARD","EMMC"]},{name:"Capacidade",hasDim:true},{name:"RPM",opts:["5400RPM","7200RPM","10000RPM","SSD"]},{name:"Interface",opts:["SATA","USB","M2","NVME","IDE"]},{name:"Formato",opts:['2.5"','3.5"',"M2","MSATA"]}] },
  "Terminal":           { fields:[{name:"Tipo",opts:["TERMINAL ANEL","TERMINAL GARFO","TERMINAL PINO","TERMINAL ILHOS"]},{name:"Bitola",hasDim:true},{name:"Material",opts:["COBRE","ALUMINIO","INOX"]},{name:"Revestimento",opts:["ESTANHADO","NIQUELADO","ISOLADO","NU"]}] },
  "Motor":              { fields:[{name:"Tipo",opts:["MONOFASICO","TRIFASICO","DC","SERVO","PASSO","BRUSHLESS"]},{name:"Potência",hasDim:true},{name:"RPM"},{name:"Tensão",opts:["110V","220V","380V","12VDC","24VDC","48VDC"]}] },
  "Filtro Elétrico":    { fields:[{name:"Tipo",opts:["EMI","RFI","PASSA BAIXA","PASSA ALTA","RC","LC"]},{name:"Corrente",hasDim:true},{name:"Tensão",hasDim:true},{name:"Encapsulamento",opts:["DIN","PAINEL","PCB","INLINE"]}] },
  "Resistor":           { fields:[{name:"Resistência"},{name:"Potência",hasDim:true},{name:"Tolerância",opts:["1%","5%","10%","20%"]},{name:"Tipo",opts:["CARBONO","METAL FILME","WIREWOUND","SMD","VARISTOR"]}] },
  "Fusível":            { fields:[{name:"Corrente",hasDim:true},{name:"Tensão",hasDim:true},{name:"Tipo",opts:["RAPIDO","LENTO","RETARDADO","CERAMICO","VIDRO"]},{name:"Encapsulamento",opts:["5X20MM","6X32MM","10X38MM","LAMINA","CARRO","NH"]}] },
  "Transformador":      { fields:[{name:"Potência",hasDim:true},{name:"Tensão Primária",hasDim:true},{name:"Tensão Secundária",hasDim:true},{name:"Tipo",opts:["ISOLAMENTO","AUTOTRANSFORMADOR","TOROIDAL","EI","UI"]}] },
  "Monitor":            { fields:[{name:"Polegadas",hasDim:true},{name:"Resolução",opts:["1024X768","1280X1024","1920X1080","2560X1440","3840X2160"]},{name:"Tipo Painel",opts:["LCD","LED","IPS","TFT","OLED","TOUCH"]}] },
  "Lâmpada/LED":        { fields:[{name:"Tipo",opts:["LED","FLUORESCENTE","INCANDESCENTE","HALOGEN","UV"]},{name:"Potência",hasDim:true},{name:"Tensão",hasDim:true},{name:"Cor",opts:["BRANCO FRIO","BRANCO QUENTE","VERDE","VERMELHO","AZUL","AMARELO"]},{name:"Base",opts:["E27","E14","G4","GU10","T8","T5","SMD"]}] },
  "Lente":              { fields:[{name:"Dist. Focal",hasDim:true},{name:"Abertura",opts:["F1.4","F1.8","F2.8","F4","F8"]},{name:"Rosca",opts:["C-MOUNT","CS-MOUNT","M12","M16","M25"]},{name:"Comprimento",hasDim:true}] },
  "Interruptor":        { fields:[{name:"Tipo",opts:["BOTOEIRA","CHAVE SELETORA","FIM DE CURSO","MICRO SWITCH","REED SWITCH"]},{name:"Polos",opts:["1P","2P","NA","NF","NA+NF"]},{name:"Posições",opts:["2 POS","3 POS","4 POS","MOMENTANEO"]},{name:"Corrente",hasDim:true}] },
  "Teclado":            { fields:[{name:"Tipo",opts:["MEMBRANA","MECANICO","INDUSTRIAL","NUMERICO","TOUCH"]},{name:"Layout",opts:["ABNT2","US","NUMERICO","PERSONALIZADO"]},{name:"Interface",opts:["USB","PS2","BLUETOOTH","WIRELESS","RS232"]}] },
  "Memória/HD/Pen":     { fields:[{name:"Tipo",opts:["HD","SSD","PEN DRIVE","SD CARD","CF CARD","EMMC"]},{name:"Capacidade",hasDim:true},{name:"Velocidade"},{name:"Interface",opts:["USB 2.0","USB 3.0","USB-C","SATA","NVME","SD"]}] },
  "Cooler/Ventilador":  { fields:[{name:"Dimensão",hasDim:true},{name:"Tensão",opts:["5V","12V","24V","110V","220V"]},{name:"RPM"},{name:"Rolamento",opts:["ESFERAS","SLEEVE","HIDRODYNAMIC"]},{name:"Conexão",opts:["2 PINOS","3 PINOS","4 PINOS"]}] },
  "Diodo":              { fields:[{name:"Tipo",opts:["RETIFICADOR","ZENER","LED","SCHOTTKY","TVS","VARICAP"]},{name:"Corrente",hasDim:true},{name:"Tensão",hasDim:true},{name:"Encapsulamento",opts:["DO41","DO15","SMD","SOD","TO220"]}] },
  "Sinalizador":        { fields:[{name:"Tipo",opts:["TORRE","BUZZER","SEMAFORO","BALIZA","LAMPADA SINALIZACAO"]},{name:"Cor",opts:["VERDE","VERMELHO","AMARELO","AZUL","BRANCO","MULTICOLOR"]},{name:"Tensão",hasDim:true},{name:"Fixação",opts:["PAINEL","DIN","COLUNA"]}] },
  "Retificador":        { fields:[{name:"Tipo",opts:["PONTE RETIFICADORA","DIODO","MODULO","TRIFASICO"]},{name:"Corrente",hasDim:true},{name:"Tensão",hasDim:true},{name:"Encapsulamento",opts:["DIP","SMD","TO220","MODULE"]}] },
  "Transistor":         { fields:[{name:"Tipo",opts:["NPN","PNP","MOSFET N","MOSFET P","IGBT","DARLINGTON"]},{name:"Tensão",hasDim:true},{name:"Corrente",hasDim:true},{name:"Encapsulamento",opts:["TO92","TO220","TO3","SMD SOT23","SMD D2PAK"]}] },
  "Botão Emergência":   { fields:[{name:"Diâmetro",hasDim:true},{name:"Contatos",opts:["1NA","1NF","1NA+1NF","2NF"]},{name:"Fixação",opts:["PAINEL 22MM","PAINEL 30MM","PAINEL 40MM"]},{name:"Cor",opts:["VERMELHO","AMARELO"]}] },
  "PLC/Controlador":    { fields:[{name:"Tipo",opts:["PLC","CLP","ARDUÍNO","RASPBERRY","CNC","MOTION"]},{name:"Entradas/Saídas"},{name:"Tensão",opts:["5V","12V","24V","110V","220V"]},{name:"Modelo"}] },
  "Inversor Freq.":     { fields:[{name:"Potência",hasDim:true},{name:"Tensão",opts:["220V","380V","440V","480V"]},{name:"Corrente",hasDim:true},{name:"Fases",opts:["MONOFASICO","TRIFASICO"]}] },
  "Conversor":          { fields:[{name:"Tipo",opts:["DC/DC","AC/DC","DC/AC","RS232/RS485","USB/SERIAL","PROTOCOLO"]},{name:"Entrada"},{name:"Saída"},{name:"Potência",hasDim:true}] },
  "Bateria":            { fields:[{name:"Tensão",hasDim:true},{name:"Capacidade",hasDim:true},{name:"Tecnologia",opts:["CHUMBO ACIDO","LITIO LI-ION","LIFEPO4","NICD","NIMH","ALCALINA"]},{name:"Tipo",opts:["RECARREGAVEL","NAO-RECARREGAVEL","SELADA"]}] },
  "Capacitor":          { fields:[{name:"Capacitância"},{name:"Tensão",hasDim:true},{name:"Tipo",opts:["ELETROLÍTICO","CERAMICO","FILM","TANTALIO","SUPERCAP","POLIESTER"]},{name:"Encapsulamento",opts:["RADIAL","AXIAL","SMD","THT"]}] },
  "Processador":        { fields:[{name:"Modelo"},{name:"Clock",hasDim:true},{name:"Núcleos",opts:["2","4","6","8","12","16","32"]},{name:"Arquitetura",opts:["x86","ARM","RISC-V","MIPS"]}] },
  "Relé":               { fields:[{name:"Tipo",opts:["ELETROMAGNETICO","SSR","TEMPORIZADO","INTERMEDIARIO","FOTOELETRICO"]},{name:"Tensão Bobina",hasDim:true},{name:"Contatos",opts:["1NA","1NF","1NA+1NF","2NA+2NF","DPDT"]},{name:"Corrente Contato",hasDim:true}] },
  "CI":                 { fields:[{name:"Modelo"},{name:"Função"},{name:"Encapsulamento",opts:["DIP","SOP","QFP","BGA","SOT","PLCC","LCC"]}] },
  "Microcontrolador":   { fields:[{name:"Modelo"},{name:"Flash",hasDim:true},{name:"Clock",hasDim:true},{name:"Encapsulamento",opts:["DIP","QFP","TQFP","LQFP","BGA"]}] },
  "Bomba":              { fields:[{name:"Tipo",opts:["CENTRIFUGA","PERISTALTICA","ENGRENAGEM","VACUO","MEMBRANA"]},{name:"Vazão",hasDim:true},{name:"Tensão",opts:["110V","220V","380V","12VDC","24VDC"]},{name:"Pressão",hasDim:true}] },
  "Microfone":          { fields:[{name:"Tipo",opts:["CONDENSER","DINAMICO","LAPELA","DIRECIONAL","OMNIDIRECIONAL"]},{name:"Sensibilidade"},{name:"Conexão",opts:["XLR","P2 3.5MM","USB","RJ45","BLUETOOTH"]}] },
  "Amplificador":       { fields:[{name:"Tipo",opts:["AUDIO","RF","OPERACIONAL","INSTRUMENTACAO","CLASSE D"]},{name:"Potência",hasDim:true},{name:"Canais",opts:["1","2","4","8"]},{name:"Impedância",opts:["4 OHM","8 OHM","16 OHM","50 OHM","75 OHM"]}] },
  "Atuador":            { fields:[{name:"Tipo",opts:["LINEAR ELETRICO","PNEUMATICO","HIDRAULICO","SERVO","PIEZOELETRICO"]},{name:"Curso",hasDim:true},{name:"Força",hasDim:true},{name:"Tensão",opts:["5V","12V","24V","110V","220V"]}] },
  "Fotoacoplador":      { fields:[{name:"Canais",opts:["1","2","4","8"]},{name:"Tensão",hasDim:true},{name:"Encapsulamento",opts:["DIP4","DIP8","SMD","SOP"]}] },
  "Estabilizador":      { fields:[{name:"Potência",hasDim:true},{name:"Entrada",opts:["110V","220V","110/220V"]},{name:"Saída",opts:["110V","220V","DUPLA"]}] },
  "Switch/Hub":         { fields:[{name:"Tipo",opts:["SWITCH","HUB","SWITCH GERENCIAVEL","SWITCH INDUSTRIAL"]},{name:"Portas",opts:["4","5","8","16","24","48"]},{name:"Velocidade",opts:["10/100MBPS","GIGABIT","10G"]},{name:"Gerenciável",opts:["SIM","NAO"]}] },
  "Roteador/Wireless":  { fields:[{name:"Tipo",opts:["ROTEADOR","ACCESS POINT","ANTENA","REPETIDOR","MODEM"]},{name:"Padrão",opts:["802.11N","802.11AC","802.11AX","5G","4G LTE"]},{name:"Velocidade"},{name:"Antenas",opts:["1","2","3","4","INTERNA"]}] },
  "Camera":             { fields:[{name:"Tipo",opts:["IP","ANALOGICA","USB","INFRAVERMELHO","TERMICA","DOME","BULLET"]},{name:"Resolução",opts:["720P","1080P","2MP","4MP","8MP 4K","12MP"]},{name:"Lente",hasDim:true},{name:"Tecnologia",opts:["CCD","CMOS","STARLIGHT","WDR"]}] },
  "Indutor/Bobina":     { fields:[{name:"Tipo",opts:["INDUTOR","BOBINA","CHOKE","TOROIDE","FERRITE"]},{name:"Indutância"},{name:"Corrente",hasDim:true},{name:"Encapsulamento",opts:["RADIAL","AXIAL","SMD","TOROIDE"]}] },
  "Oscilador/Crystal":  { fields:[{name:"Tipo",opts:["CRYSTAL","OSCILADOR","TCXO","OCXO","VCXO"]},{name:"Frequência",hasDim:true},{name:"Tensão",hasDim:true},{name:"Encapsulamento",opts:["HC49","SMD","DIP","SIP"]}] },
  "Dissipador":         { fields:[{name:"Tipo",opts:["DISSIPADOR","TERMISTOR","NTC","PTC","TERMOPAR"]},{name:"Dimensão",hasDim:true},{name:"Material",opts:["ALUMINIO","COBRE","GRAFITE"]},{name:"Fixação",opts:["PARAFUSO","CLIP","ADESIVO","SMD"]}] },
  "Ar Condicionado":    { fields:[{name:"Tipo",opts:["SPLIT","JANELA","PORTATIL","INDUSTRIAL","PRECISAO"]},{name:"BTUs",hasDim:true},{name:"Tensão",opts:["110V","220V","380V"]},{name:"Ciclo",opts:["FRIO","QUENTE/FRIO","INVERTER"]}] },
  "Termistor":          { fields:[{name:"Tipo",opts:["NTC","PTC","TERMOPAR K","TERMOPAR J","PT100","PT1000"]},{name:"Resistência",hasDim:true},{name:"Temperatura",hasDim:true},{name:"Encapsulamento",opts:["SMD","AXIAL","RADIAL","SONDA"]}] },
  "Chicote Cabos":      { fields:[{name:"Vias"},{name:"Comprimento",hasDim:true},{name:"Aplicação"},{name:"Conector",opts:["JST","MOLEX","DUPONT","PERSONALIZADO"]}] },
  "Gerador Energia":    { fields:[{name:"Potência",hasDim:true},{name:"Combustível",opts:["GASOLINA","DIESEL","GAS","BIGAS"]},{name:"Tensão",opts:["110V","220V","380V","TRIFASICO"]},{name:"Fase",opts:["MONOFASICO","TRIFASICO"]}] },
  "Painel Elétrico":    { fields:[{name:"Tipo",opts:["QUADRO","PAINEL","RACK","GABINETE"]},{name:"Dimensão",hasDim:true},{name:"Tensão",opts:["24V","110V","220V","380V"]},{name:"IP",opts:["IP20","IP44","IP54","IP65","IP67"]}] },
  "Cintilador":         { fields:[{name:"Material",opts:["NaI","CsI","BGO","LSO","PLÁSTICO"]},{name:"Dimensão",hasDim:true},{name:"Aplicação",opts:["RAIOS-X","GAMMA","BETA","NUCLEAR"]}] },
  // ── 21 MATERIAL MECÂNICO ─────────────────────────────────────
  "Parafuso":           { fields:[{name:"Cabeça",opts:["SEXTAVADO","CILINDRICO","CHATA","PANELA","ALLEN","FENDA","PHILLIPS","TORX"]},{name:"Rosca",opts:["M2","M3","M4","M5","M6","M8","M10","M12","M14","M16","M20","M24","UNC","UNF"]},{name:"Comprimento",hasDim:true},{name:"Material",opts:["ACO SAE","INOX 304","INOX 316","ALUMINIO","LATAO","NYLON"]},{name:"Acabamento",opts:["ZINCADO","NIQUELADO","FOSFATADO","NATURAL","GALVANIZADO","OXIDADO"]}] },
  "Porca":              { fields:[{name:"Rosca",opts:["M2","M3","M4","M5","M6","M8","M10","M12","M14","M16","M20"]},{name:"Tipo",opts:["SEXTAVADA","BORBOLETA","CEGA","TRAVAMENTO","DIN 934","DIN 985"]},{name:"Material",opts:["ACO","INOX 304","INOX 316","ALUMINIO","LATAO"]},{name:"Acabamento",opts:["ZINCADO","NIQUELADO","NATURAL","GALVANIZADO"]}] },
  "Arruela":            { fields:[{name:"Tipo",opts:["PLANA","MOLA","DENTADA","CONICA","DIN 125","DIN 127","DIN 6798"]},{name:"Medida",hasDim:true},{name:"Material",opts:["ACO","INOX 304","INOX 316","ALUMINIO","BORRACHA","NYLON"]}] },
  "Rolamento":          { fields:[{name:"Modelo"},{name:"Tipo",opts:["ESFERAS","ROLOS","AGULHA","AXIAL","AUTOALINHANTE"]},{name:"Vedação",opts:["ABERTO","ZZ","2RS","2Z","RS"]},{name:"Material",opts:["ACO CROMADO","INOX","CERAMICA","PLASTICO"]}] },
  "Mangueira":          { fields:[{name:"Tipo",opts:["BORRACHA","PVC","POLIURETANO","METAL FLEXIVEL","TRANSSADA"]},{name:"Diâmetro",hasDim:true},{name:"Pressão",hasDim:true},{name:"Material",opts:["BORRACHA","PVC","PTFE","NYLON","INOX"]}] },
  "Chapa":              { fields:[{name:"Material",opts:["ACO SAE 1020","ACO INOX 304","ACO INOX 316","ALUMINIO 6061","GALVANIZADO","ZINCADO","COBRE"]},{name:"Espessura",hasDim:true},{name:"Largura",hasDim:true},{name:"Comprimento",hasDim:true}] },
  "Tubo":               { fields:[{name:"Tipo",opts:["REDONDO","QUADRADO","RETANGULAR","PERFIL U","PERFIL L"]},{name:"Diâmetro/Dim.",hasDim:true},{name:"Espessura",hasDim:true},{name:"Material",opts:["ACO SAE 1020","INOX 304","INOX 316","ALUMINIO","COBRE","PVC","ELETRODUTO"]},{name:"Comprimento",hasDim:true}] },
  "Mola":               { fields:[{name:"Tipo",opts:["COMPRESSAO","TRACAO","TORCAO","DISCO BELLEVILLE","ESPIRAL"]},{name:"Diâmetro Ext.",hasDim:true},{name:"Comprimento",hasDim:true},{name:"Material",opts:["ACO MOLA","INOX 304","INOX 316","FOSFOR BRONZE"]}] },
  "Gaxeta":             { fields:[{name:"Material",opts:["BORRACHA","NBR","EPDM","VITOM","PTFE","GRAFITE","FIBRA"]},{name:"Dimensão",hasDim:true},{name:"Aplicação",opts:["OLEO","AGUA","AR","VAPOR","QUIMICO"]}] },
  "Correia":            { fields:[{name:"Tipo",opts:["DENTADA","PLANA","EM V","POLY-V","TIMING"]},{name:"Comprimento",hasDim:true},{name:"Largura",hasDim:true},{name:"Passo",opts:["T2.5","T5","T10","HTD 3M","HTD 5M","HTD 8M","XL","L","H"]}] },
  "Redutor":            { fields:[{name:"Tipo",opts:["CICLOIDICO","PLANETARIO","VERMIFUGO","HELICAL","CONICO"]},{name:"Relação Redução"},{name:"Potência",hasDim:true},{name:"Modelo"}] },
  "Peça Usinada":       { fields:[{name:"Nome/Função"},{name:"Material",opts:["ACO 1020","ACO 4140","INOX 304","ALUMINIO 6061","NYLON","POLIACETAL"]},{name:"Dimensão Principal",hasDim:true},{name:"Processo",opts:["TORNEAR","FRESAR","RETIFICAR","SOLDAR","DOBRAR"]}] },
  // ── 22 MATERIAL SUPORTE ──────────────────────────────────────
  "Software":           { fields:[{name:"Função"},{name:"Versão"},{name:"Licença",opts:["PERPÉTUA","ANUAL","MENSAL","OEM","OPEN SOURCE"]}] },
  "Etiqueta/Adesivo":   { fields:[{name:"Tipo",opts:["ETIQUETA","PLAQUETA","ADESIVO","PLACA"]},{name:"Material",opts:["PAPEL","POLIESTER","ALUMINIO","INOX","PVC"]},{name:"Dimensão",hasDim:true},{name:"Cor",opts:["BRANCO","PRATA","TRANSPARENTE","PERSONALIZADO"]}] },
  "Tinta":              { fields:[{name:"Tipo",opts:["ESMALTE","LATEX","EPOXI","PRIMER","ZARCAO","SPRAY"]},{name:"Cor"},{name:"Volume",hasDim:true},{name:"Secagem",opts:["AR","ESTUFA","UV"]}] },
  "Vidro":              { fields:[{name:"Tipo",opts:["COMUM","TEMPERADO","LAMINADO","ACRILICO","POLICARBONATO"]},{name:"Espessura",hasDim:true},{name:"Dimensão",hasDim:true}] },
  "Solda/Estanho":      { fields:[{name:"Tipo",opts:["ESTANHO","ELETRODO","SOLDA MIG","SOLDA TIG","PASTA SOLDA"]},{name:"Liga",opts:["60/40","63/37","SAC305","SN100","E6013","E7018"]},{name:"Diâmetro",hasDim:true},{name:"Peso/Comp.",hasDim:true}] },
  // ── 23 EXPEDIENTE ────────────────────────────────────────────
  "Cartucho/Toner":     { fields:[{name:"Tipo",opts:["TONER","CARTUCHO TINTA","FITA"]},{name:"Modelo Impressora"},{name:"Cor",opts:["PRETO","CIANO","MAGENTA","AMARELO","COLORIDO"]},{name:"Rendimento",hasDim:true}] },
  "Material Escritório":{ fields:[{name:"Tipo"},{name:"Modelo/Cor"},{name:"Dimensão/Qtd.",hasDim:true}] },
  "Celular":            { fields:[{name:"Marca",opts:["SAMSUNG","APPLE","MOTOROLA","XIAOMI","OUTROS"]},{name:"Modelo"},{name:"Armazenamento",hasDim:true},{name:"Sistema",opts:["ANDROID","IOS"]}] },
  // ── 24 MATERIAL IMOBILIZADO ──────────────────────────────────
  "Ferramenta":         { fields:[{name:"Tipo"},{name:"Dimensão",hasDim:true},{name:"Material",opts:["ACO RAPIDO","ACO INOX","WIDEA","CERAMICA"]},{name:"Aplicação"}] },
  "Máquina/Equipamento":{ fields:[{name:"Tipo"},{name:"Modelo"},{name:"Potência",hasDim:true},{name:"Tensão",opts:["110V","220V","380V","12VDC","24VDC"]}] },
  "Instrumento Medição":{ fields:[{name:"Tipo",opts:["PAQUIMETRO","MICROMETRO","MULTIMETRO","OSCILOSCÓPIO","MANÔMETRO","TERMÔMETRO"]},{name:"Faixa",hasDim:true},{name:"Precisão"},{name:"Modelo"}] },
  // ── 25 SEG. TRABALHO ─────────────────────────────────────────
  "Luva EPI":           { fields:[{name:"Material",opts:["BORRACHA","NEOPRENE","NITRILA","COURO","MALHA DE ACO","RASPA"]},{name:"Tamanho",opts:["P","M","G","GG","7","8","9","10","11"]},{name:"Aplicação",opts:["ELETRICA","QUIMICA","CORTE","SOLDA","MECANICA"]}] },
  "Capacete EPI":       { fields:[{name:"Cor",opts:["BRANCO","AMARELO","LARANJA","VERDE","AZUL","VERMELHO"]},{name:"Classe",opts:["CLASSE A","CLASSE B","CLASSE C"]},{name:"Ajuste",opts:["AUTOLOCK","CATRACA","ELASTICO"]}] },
  "Óculos EPI":         { fields:[{name:"Tipo",opts:["SEGURANÇA","AMPLA VISAO","SOLDAR","LASER"]},{name:"Lente",opts:["INCOLOR","FUMÊ","VERDE","DOURADO"]},{name:"Tratamento",opts:["ANTIRRISCO","ANTIEMBAÇANTE","UV","POLARIZADO"]}] },
  "Extintor":           { fields:[{name:"Classe",opts:["A","B","C","AB","ABC","D"]},{name:"Capacidade",hasDim:true},{name:"Agente",opts:["PO QUIMICO","CO2","AGUA","ESPUMA","HALON"]}] },
  // ── 26 PA/MR ─────────────────────────────────────────────────
  "Scanner":            { fields:[{name:"Modelo"},{name:"Túnel",hasDim:true},{name:"Tecnologia",opts:["RAIOS-X","DUPLA VISTA","MULTI VISTA","CT"]},{name:"Tensão",opts:["110V","220V","380V"]}] },
  "CFTV":               { fields:[{name:"Tipo",opts:["DVR","NVR","CAMERA IP","CAMERA ANALOGICA","SPEED DOME"]},{name:"Canais",opts:["4","8","16","32","64"]},{name:"Resolução",opts:["720P","1080P","4MP","8MP 4K"]},{name:"Armazenamento",hasDim:true}] },
  "Controle Acesso":    { fields:[{name:"Tipo",opts:["LEITOR BIOMETRICO","LEITOR RFID","LEITOR FACIAL","CONTROLADOR","FECHADURA"]},{name:"Tecnologia",opts:["BIOMETRIA","RFID","FACIAL","SENHA","QR CODE"]},{name:"Modelo"}] },
  "Alarme":             { fields:[{name:"Tipo",opts:["CENTRAL","SIRENE","DETECTOR PIR","CONTATO MAGNETICO","BATERIA"]},{name:"Alcance",hasDim:true},{name:"Tensão",hasDim:true}] },
  // ── 27 PRODUTOS INTERMEDIÁRIOS ───────────────────────────────
  "Subconjunto":        { fields:[{name:"Tipo",opts:["MECANICO","ELETRONICO","ALTA ENERGIA","BAIXA ENERGIA","SEG. ELETRONICA","DETECTOR METAL"]},{name:"Modelo"},{name:"Versão"}] },
  "Spare Part":         { fields:[{name:"Modelo"},{name:"Aplicação"},{name:"Versão"}] },
  // ── 28 SERVIÇOS ──────────────────────────────────────────────
  "Serviço Instalação": { fields:[{name:"Tipo",opts:["INSTALACAO","MANUTENCAO","COMISSIONAMENTO","RETROFIT"]},{name:"Local"},{name:"Equipamento"}] },
  "Treinamento":        { fields:[{name:"Tema"},{name:"Carga Horária",hasDim:true},{name:"Modalidade",opts:["PRESENCIAL","EAD","HIBRIDO"]}] },
  // ── 30 REMANUFATURADO ─────────────────────────────────────────
  "Remanufaturado":     { fields:[{name:"Tipo",opts:["BAIXA ENERGIA","CFTV","SCANNER","MODULO"]},{name:"Modelo"},{name:"Versão"}] },
  // ── 31 RESÍDUO ───────────────────────────────────────────────
  "Sucata":             { fields:[{name:"Material",opts:["FERRO","ALUMINIO","COBRE","ELETRONICO","MISTO"]},{name:"Origem"},{name:"Peso Aprox.",hasDim:true}] },
  // ── 33/34 CONJUNTOS E ACESSÓRIOS ─────────────────────────────
  "Conjunto/Peça Mec.": { fields:[{name:"Modelo",opts:["5020","5333","6040","5536","6550","7550","100100","150180","180180","BODYSCAN","FLATSCAN","CARGO","SMART LANE"]},{name:"Tipo",opts:["SV","DV","M","P3D","TROLLEY","MOVEL","VERTICAL"]},{name:"Versão"}] },
  "Embalagem":          { fields:[{name:"Tipo",opts:["CAIXA","PALETE","BLISTER","FILME","ESPUMA","ISOPOR"]},{name:"Dimensão",hasDim:true},{name:"Material",opts:["PAPELAO","MADEIRA","PLASTICO","EPS","PET"]}] },
  "Acessório":          { fields:[{name:"Tipo",opts:["TOTEM","MESA ROLETES","ESTEIRA","BIOMBO","BALANCA","GERADOR RX","RAMPA"]},{name:"Dimensão",hasDim:true},{name:"Material",opts:["ACO","ALUMINIO","INOX","PLASTICO"]}] },
  // ── 98/99 SERVIÇO/CONSUMO ────────────────────────────────────
  "Serviço":            { fields:[{name:"Tipo"},{name:"Descrição Complementar"}] },
  "Consumo":            { fields:[{name:"Tipo"},{name:"Finalidade"}] },
  "Mão de Obra":        { fields:[{name:"Processo"},{name:"Setor"},{name:"Atividade"}] },
};

// Campo dimensional: valor + unidade de medida
abel, value, onChange }: any) {
  const [val, setVal] = useState((value||"").replace(/[A-Z°]+$/, ""));
  const [unit, setUnit] = useState((value||"").match(/([A-Z°]+)$/)?.[1] || "MM");
  useEffect(() => {
    if (val) onChange(`${val}${unit}`);
    else onChange("");
  }, [val, unit]);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
      <label style={{ fontSize:11, fontWeight:600, color:C.textSub, letterSpacing:0.5, textTransform:"uppercase" }}>{label}</label>
      <div style={{ display:"flex", gap:6 }}>
        <input placeholder="Valor" value={val} onChange={e=>setVal(e.target.value.replace(/[^0-9.,]/g,""))}
          style={{ ...iS, flex:1, minWidth:0 }}/>
        <select value={unit} onChange={e=>setUnit(e.target.value)}
          style={{ ...iS, width:72, cursor:"pointer", padding:"10px 6px", flexShrink:0 }}>
          {UNIDADES_DIM.map(u=><option key={u}>{u}</option>)}
        </select>
      </div>
    </div>
  );
}

function DescBuilder({ sigla, onChange }: { sigla:string, onChange:(desc:string)=>void }) {
  const [tipo, setTipo] = useState("");
  const [vals, setVals] = useState<Record<string,string>>({});
  const [extra, setExtra] = useState("");

  const template = tipo ? DESC_TEMPLATES[tipo] : null;
  const fields = template?.fields || [];

  useEffect(() => {
    if (!tipo) return;
    const parts = [
      tipo.toUpperCase(),
      ...fields.map(f => vals[f.name]||"").filter(Boolean),
      ...(extra.trim() ? [extra.trim().toUpperCase()] : []),
    ];
    onChange(parts.join(" ").slice(0, 90));
  }, [tipo, vals, extra]);

  const preview = tipo ? [
    tipo.toUpperCase(),
    ...fields.map(f=>vals[f.name]||"").filter(Boolean),
    ...(extra.trim()?[extra.trim().toUpperCase()]:[]),
  ].join(" ") : "";

  return (
    <div style={{ background:C.surfaceMid, border:`1px solid ${C.yellowBorder}`, borderRadius:10, padding:18, marginBottom:8 }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
        <Icon name="zap" size={14} color={C.yellow}/>
        <span style={{ fontSize:11, color:C.yellow, fontWeight:700, letterSpacing:0.5, textTransform:"uppercase" }}>
          Construtor Automático de Descrição
        </span>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <div style={{ gridColumn:"1/-1" }}>
          <Field label="Tipo de Componente" type="select" placeholder="Selecione o tipo..." value={tipo}
            onChange={(e:any)=>{setTipo(e.target.value);setVals({});setExtra("");}}
            options={Object.keys(DESC_TEMPLATES)}/>
        </div>
        {fields.map(f => (
          <div key={f.name}>
            {f.hasDim
              ? <DimField label={f.name} value={vals[f.name]||""} onChange={(v:string)=>setVals(prev=>({...prev,[f.name]:v}))}/>
              : f.opts
                ? <Field label={f.name} type="select" placeholder="Selecione..." value={vals[f.name]||""}
                    onChange={(e:any)=>setVals(prev=>({...prev,[f.name]:e.target.value}))} options={f.opts}/>
                : <Field label={f.name} placeholder="Digite..." value={vals[f.name]||""}
                    onChange={(e:any)=>setVals(prev=>({...prev,[f.name]:e.target.value}))}/>
            }
          </div>
        ))}
        {tipo && (
          <div style={{ gridColumn:"1/-1" }}>
            <Field label="Complemento (opcional)" placeholder="Ex: ROSCA ESQUERDA, GRAU ALIMENTICIO, COR PRETA..."
              value={extra} onChange={(e:any)=>setExtra(e.target.value)}/>
            <div style={{ fontSize:10, color:C.textMuted, marginTop:4 }}>Adicione detalhes não cobertos pelos campos acima</div>
          </div>
        )}
      </div>
      {preview && (
        <div style={{ marginTop:14, padding:"10px 14px", background:C.bg, borderRadius:6, border:`1px solid ${C.yellow}40` }}>
          <div style={{ fontSize:10, color:C.yellow, textTransform:"uppercase", fontWeight:700, marginBottom:4, letterSpacing:.5 }}>Preview da Descrição</div>
          <div style={{ fontFamily:"monospace", fontSize:13, color:C.yellow, wordBreak:"break-all" }}>{preview.toUpperCase()}</div>
          <div style={{ fontSize:10, color:preview.length>80?C.red:C.textMuted, marginTop:4 }}>{preview.length}/90 caracteres</div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// ITEM DE SOLICITAÇÃO

// ══════════════════════════════════════════════════════════════════
const emptyItem = () => ({
  id: crypto.randomUUID(),
  descricao:"", sigla:"", unidade:"", fabricante:"", modelo:"",
  desc_detalhada:"", ncm:"", grupo:"", armazem:"",
  importado:false, kanban:false, prototipo:false, chumbo:false,
  control_scf:false, custo:"", cod_mecanico:"", desc_ingles:"", estrutura_cod:"", estrutura_desc:"", expanded:true,
});

const UNIDADES = ["UN","KG","MT","PC","LT","CX","PÇ","PAR","M²","GL","HR"];
const ARMAZENS = ["01 – Almoxarifado Geral","02 – Produção","03 – Expedição","04 – Quarentena","99 – Virtual"];

function ItemForm({ item, idx, onChange, onRemove, planilha }: any) {
  const [showDrop, setShowDrop] = useState(false);
  const [sugestoes, setSugestoes] = useState<any[]>([]);
  const [useBuilder, setUseBuilder] = useState(false);

  const set = (k: string) => (e: any) => onChange({ ...item, [k]: e?.target ? e.target.value : e });

  useEffect(() => {
    if (!item.descricao || item.descricao.length < 2) { setSugestoes([]); return; }
    const q = item.descricao.toUpperCase();
    setSugestoes(planilha.filter((p:any) => p.descricao.toUpperCase().includes(q) || p.codigo.toUpperCase().includes(q)).slice(0,6));
  }, [item.descricao, planilha]);

  // Validação código mecânico para MP
  const codMecError = item.cod_mecanico && item.sigla === "MP" && !item.cod_mecanico.startsWith("3")
    ? "Código mecânico deve começar com 3" : "";

  const isMPorElec = true; // Construtor disponível para todos os tipos

  // ── Grupos que exigem Control SCF obrigatório ─────────────────
  const GRUPOS_SCF = ["2003","2005","2006","2007","2008","2009","2010","2014","2019","2036","2038","2053","2057"];
  const grupoCode = (item.grupo||"").split(" - ")[0].trim();
  const isSCFObrigatorio = GRUPOS_SCF.includes(grupoCode);

  // Auto-marcar control_scf quando grupo exige
  useEffect(() => {
    if (isSCFObrigatorio && !item.control_scf) {
      onChange({ ...item, control_scf: true });
    }
  }, [item.grupo]);

  // ── Armazém automático por sigla ──────────────────────────────
  // =SE(TIPO="MP";"10";SE(TIPO="AI";"10";SE(TIPO="MC";"40";SE(TIPO="MR";"11";SE(TIPO="PA";"20";SE(TIPO="PI";"01";"10"))))))
  function calcArmazem(sigla: string): string {
    if (sigla === "MP") return "10";
    if (sigla === "AI") return "10";
    if (sigla === "MC") return "40";
    if (sigla === "MR") return "11";
    if (sigla === "PA") return "20";
    if (sigla === "PI") return "01";
    return "10";
  }
  useEffect(() => {
    if (item.sigla) {
      const armazem = calcArmazem(item.sigla);
      if (item.armazem !== armazem) {
        onChange({ ...item, armazem });
      }
    }
  }, [item.sigla]);

  // ── 1. Auto-append código mecânico na descrição ───────────────
  useEffect(() => {
    if (!item.cod_mecanico) return;
    // Remove qualquer sufixo antigo " / XXXXX" e adiciona o novo
    const base = item.descricao.replace(/\s*\/\s*[\w.]+$/, "").trim();
    const nova = base ? `${base} / ${item.cod_mecanico}` : item.descricao;
    if (nova !== item.descricao && nova.length <= 90) {
      onChange({ ...item, descricao: nova });
    }
  }, [item.cod_mecanico]);

  // ── 2. Placeholder XX.XX.XXXXX para PI e PA sem cod_mecanico ──
  const descPreview = (() => {
    if (!item.descricao) return "";
    if ((item.sigla === "PI" || item.sigla === "PA") && !item.cod_mecanico) {
      const base = item.descricao.replace(/\s*\/\s*XX\.XX\.XXXXX.*$/, "").trim();
      return base ? `${base} / XX.XX.XXXXX` : base;
    }
    return item.descricao;
  })();

  return (
    <div style={{ border:`1px solid ${C.border}`, borderRadius:10, overflow:"hidden", marginBottom:14, transition:"box-shadow .2s", boxShadow:"0 2px 8px rgba(0,0,0,.2)" }}>
      <div style={{ background:C.surfaceMid, padding:"13px 18px", display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}
        onClick={()=>onChange({...item, expanded:!item.expanded})}>
        <div style={{ width:26, height:26, borderRadius:6, background:C.yellowDim, border:`1px solid ${C.yellowBorder}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:C.yellow, flexShrink:0 }}>{idx+1}</div>
        <span style={{ flex:1, fontSize:13, fontWeight:600, color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.descricao || "Item sem descrição"}</span>
        {item.sigla && <span style={{ background:C.yellowDim, border:`1px solid ${C.yellowBorder}`, borderRadius:4, fontSize:10, fontWeight:700, color:C.yellow, padding:"2px 8px" }}>{item.sigla}</span>}
        <Icon name={item.expanded?"chevron_up":"chevron_down"} size={14} color={C.textMuted}/>
        <button onClick={e=>{e.stopPropagation();onRemove();}} style={{ background:"none", border:"none", color:C.red, cursor:"pointer", display:"flex", padding:4, borderRadius:4, transition:"background .15s" }}
          onMouseEnter={e=>e.currentTarget.style.background=C.redDim} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <Icon name="trash" size={14} color={C.red}/>
        </button>
      </div>

      {item.expanded && (
        <div style={{ padding:18 }}>
          {/* Toggle construtor — obrigatório para MP */}
          {item.sigla === "MP" ? (
            <div style={{ marginBottom:14, padding:"10px 14px", background:C.yellowDim, borderRadius:8, border:`1px solid ${C.yellowBorder}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                <Icon name="zap" size={13} color={C.yellow}/>
                <span style={{ fontSize:11, color:C.yellow, fontWeight:700, letterSpacing:0.5, textTransform:"uppercase" }}>Construtor de Descrição — Obrigatório para MP</span>
              </div>
              <Toggle label="Ativar construtor automático" value={useBuilder} onChange={setUseBuilder}/>
              {!useBuilder && <div style={{ marginTop:6, fontSize:11, color:C.red }}>⚠ Para MP o construtor deve ser utilizado para garantir padronização.</div>}
            </div>
          ) : (
            <div style={{ marginBottom:14, padding:"10px 14px", background:C.bg, borderRadius:8, border:`1px solid ${C.border}` }}>
              <Toggle label="⚡ Usar construtor automático de descrição" value={useBuilder} onChange={setUseBuilder}/>
            </div>
          )}
          {useBuilder && (
            <DescBuilder sigla={item.sigla} onChange={(desc:string)=>onChange({...item,descricao:desc})}/>
          )}

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            {/* Descrição com autocomplete */}
            <div style={{ gridColumn:"1/-1", position:"relative" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                <label style={{ fontSize:11, fontWeight:600, color:C.textSub, letterSpacing:0.5, textTransform:"uppercase" }}>Descrição do Produto<span style={{ color:C.yellow, marginLeft:3 }}>*</span></label>
                <span style={{ fontSize:10, color:(item.descricao?.length||0)>80?C.red:C.textMuted }}>{item.descricao?.length||0}/90</span>
              </div>
              <input maxLength={90} placeholder="Máx. 90 caracteres — ou use o construtor acima"
                value={item.descricao}
                onChange={e=>{
                  // Strip PI/PA placeholder on manual edit
                  const v = e.target.value.replace(/ \/ XX\.XX\.XXXXX$/,"");
                  onChange({...item,descricao:v});
                  setShowDrop(true);
                }} style={iS}
                onBlur={()=>setTimeout(()=>setShowDrop(false),200)}/>
              {(item.sigla==="PI"||item.sigla==="PA") && !item.cod_mecanico && item.descricao && (
                <div style={{ marginTop:4, fontSize:11, color:C.textMuted, fontFamily:"monospace" }}>
                  Preview: <span style={{ color:C.yellow }}>{descPreview}</span>
                  <span style={{ marginLeft:6, color:C.textMuted, fontSize:10 }}>(código será atribuído na integração)</span>
                </div>
              )}
              {showDrop && sugestoes.length > 0 && (
                <div style={{ position:"absolute", top:"100%", left:0, right:0, background:C.surfaceMid, border:`1px solid ${C.border}`, borderRadius:"0 0 8px 8px", zIndex:100, maxHeight:180, overflowY:"auto", boxShadow:"0 8px 24px rgba(0,0,0,.4)" }}>
                  {sugestoes.map((s:any) => (
                    <div key={s.codigo} onMouseDown={()=>onChange({...item,descricao:s.descricao})}
                      style={{ padding:"9px 14px", cursor:"pointer", borderBottom:`1px solid ${C.border}`, display:"flex", gap:10 }}
                      onMouseEnter={e=>e.currentTarget.style.background=C.yellowDim} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <span style={{ fontFamily:"monospace", fontSize:11, color:C.yellow, minWidth:70 }}>{s.codigo}</span>
                      <span style={{ fontSize:12, color:C.text }}>{s.descricao}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sigla (campo Tipo renomeado) */}
            <Field label="Tipo" type="select" placeholder="Selecione..." value={item.sigla} onChange={set("sigla")} required
              options={SIGLAS.map(s => ({ value:s.value, label:s.label }))}/>

            <SearchSelect label="Unidade de Medida" value={item.unidade} onChange={(v:string)=>onChange({...item,unidade:v})} options={UNIDADES} placeholder="Buscar unidade..." required/>

            <Field label="Fabricante / Fornecedor" placeholder="Ex: ABB, WEG, FESTO..." value={item.fabricante} onChange={set("fabricante")}/>
            <Field label="Modelo / Referência" placeholder="Ex: W21, CFW500..." value={item.modelo} onChange={set("modelo")}/>
            <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
              <label style={{ fontSize:11, fontWeight:600, color:C.textSub, letterSpacing:0.5, textTransform:"uppercase" }}>NCM<span style={{ color:C.yellow, marginLeft:3 }}>*</span></label>
              <input
                placeholder="0000.00.00"
                value={item.ncm}
                maxLength={10}
                inputMode="numeric"
                onChange={e => {
                  const raw = e.target.value.replace(/[^0-9]/g, "").slice(0, 8);
                  let masked = raw;
                  if (raw.length > 4) masked = raw.slice(0,4) + "." + raw.slice(4);
                  if (raw.length > 6) masked = raw.slice(0,4) + "." + raw.slice(4,6) + "." + raw.slice(6);
                  onChange({...item, ncm: masked});
                }}
                style={iS}
              />
            </div>

            <div>
              <SearchSelect label="Grupo Protheus" value={item.grupo} onChange={(v:string)=>onChange({...item,grupo:v})} options={GRUPOS_PROTHEUS_ITENS} placeholder="Buscar grupo..." required/>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
              <label style={{ fontSize:11, fontWeight:600, color:C.textSub, letterSpacing:0.5, textTransform:"uppercase" }}>Custo Estimado (R$)</label>
              <input
                placeholder="Ex: 1.250,00"
                value={item.custo}
                inputMode="numeric"
                onChange={e => {
                  let raw = e.target.value.replace(/[^0-9]/g, "");
                  if (!raw) { onChange({...item, custo:""}); return; }
                  const cents = parseInt(raw, 10);
                  const formatted = (cents / 100).toLocaleString("pt-BR", { minimumFractionDigits:2, maximumFractionDigits:2 });
                  onChange({...item, custo: formatted});
                }}
                style={iS}
              />
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
              <label style={{ fontSize:11, fontWeight:600, color:C.textSub, letterSpacing:0.5, textTransform:"uppercase" }}>Armazém (automático)</label>
              <div style={{ ...iS, background:"#0A0D13", color:item.sigla?C.yellow:C.textMuted, border:`1px solid ${item.sigla?C.yellowBorder:C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 13px" }}>
                <span style={{ fontFamily:"monospace", fontWeight:700 }}>{item.sigla ? `${calcArmazem(item.sigla)} — ${item.sigla==="MC"?"Almoxarifado Consumo":item.sigla==="MR"?"Revenda":item.sigla==="PA"?"Produto Acabado":item.sigla==="PI"?"Produto Intermediário":"Almoxarifado Geral"}` : "Selecione o Tipo primeiro"}</span>
                {item.sigla && <span style={{ fontSize:10, color:C.yellow, background:C.yellowDim, borderRadius:3, padding:"1px 6px" }}>AUTO</span>}
              </div>
            </div>

            {/* Código Mecânico — só para MP com validação */}
            <div>
              <Field label="Código de Produto Mecânico (opcional)" placeholder="Ex: 33.22.11111.00" value={item.cod_mecanico} onChange={set("cod_mecanico")}/>
            <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
              <label style={{ fontSize:11, fontWeight:600, color:C.textSub, letterSpacing:0.5, textTransform:"uppercase" }}>Estrutura Similar (opcional)</label>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                <input placeholder="Código da estrutura" value={item.estrutura_cod||""} onChange={e=>onChange({...item,estrutura_cod:e.target.value})} style={iS}/>
                <input placeholder="Descrição da estrutura" value={item.estrutura_desc||""} onChange={e=>onChange({...item,estrutura_desc:e.target.value})} style={iS}/>
              </div>
            </div>
              {codMecError && <div style={{ marginTop:4, fontSize:11, color:C.red, display:"flex", alignItems:"center", gap:4 }}><Icon name="alert" size={11} color={C.red}/>{codMecError}</div>}
            </div>

            <div style={{ gridColumn:"1/-1" }}>
              <Field label="Descrição Técnica Detalhada" type="textarea" placeholder="Características técnicas, aplicação, dimensões, normas..." value={item.desc_detalhada} onChange={set("desc_detalhada")}/>
            </div>

            <div style={{ gridColumn:"1/-1", background:C.surfaceMid, borderRadius:8, padding:16, border:`1px solid ${C.border}`, display:"flex", flexDirection:"column", gap:11 }}>
              <Toggle label="Produto Importado?" value={item.importado} onChange={(v:boolean)=>onChange({...item,importado:v})}/>
              {item.importado && (
                <div style={{ padding:"12px 0 4px 0", animation:"fadeIn .2s ease" }}>
                  <Field label="Descrição em Inglês (obrigatória para importados)" placeholder="Ex: HEXAGONAL SCREW M8 X 30 ZINC PLATED" value={item.desc_ingles||""} onChange={(e:any)=>onChange({...item,desc_ingles:e.target.value})} required/>
                </div>
              )}
              <div style={{ height:1, background:C.border }}/>
              <Toggle label="Controle Kanban" value={item.kanban} onChange={(v:boolean)=>onChange({...item,kanban:v})}/>
              <div style={{ height:1, background:C.border }}/>
              <Toggle label="Protótipo / Desenvolvimento" value={item.prototipo} onChange={(v:boolean)=>onChange({...item,prototipo:v})}/>
              <div style={{ height:1, background:C.border }}/>
              <Toggle label="Contém Chumbo (RoHS)?" value={item.chumbo} onChange={(v:boolean)=>onChange({...item,chumbo:v})}/>
              <div style={{ height:1, background:C.border }}/>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:13, color:isSCFObrigatorio?C.yellow:C.textSub }}>Control SCF</span>
                  {isSCFObrigatorio && <span style={{ fontSize:10, color:C.yellow, background:C.yellowDim, border:`1px solid ${C.yellowBorder}`, borderRadius:4, padding:"1px 6px", fontWeight:700 }}>OBRIGATÓRIO</span>}
                </div>
                <div style={{ width:38, height:22, borderRadius:11, background:item.control_scf?C.yellow:C.border, position:"relative", cursor:isSCFObrigatorio?"not-allowed":"pointer", opacity:isSCFObrigatorio?0.85:1, transition:"background 0.2s", flexShrink:0 }}
                  onClick={()=>{ if(!isSCFObrigatorio) onChange({...item,control_scf:!item.control_scf}); }}>
                  <div style={{ position:"absolute", top:3, left:item.control_scf?19:3, width:16, height:16, borderRadius:"50%", background:"#fff", transition:"left 0.2s", boxShadow:"0 1px 4px rgba(0,0,0,.4)" }}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// TELA DE LOGIN
// ══════════════════════════════════════════════════════════════════
function LoginScreen({ onLogin }: { onLogin: (role:string, userName?:string)=>void }) {
  const [mode, setMode] = useState<"select"|"mdm"|"dev">("select");
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async (isMDM: boolean) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 300)); // feedback animado
    if (isMDM) {
      const found = USERS_MDM.find(u => u.user===user && u.pass===pass);
      found ? onLogin("mdm", found.user) : setError("Usuário ou senha incorretos.");
    } else {
      user===USER_DEV.user && pass===USER_DEV.pass ? onLogin("dev", user) : setError("Usuário ou senha incorretos.");
    }
    setLoading(false);
  };

  return (
    <div style={{ display:"flex", height:"100vh", background:C.bg, alignItems:"center", justifyContent:"center", fontFamily:"'IBM Plex Sans',sans-serif" }}>
      {/* Background decorativo */}
      <div style={{ position:"fixed", inset:0, overflow:"hidden", pointerEvents:"none" }}>
        <div style={{ position:"absolute", top:-200, left:-200, width:600, height:600, borderRadius:"50%", background:`radial-gradient(circle, ${C.yellow}08 0%, transparent 70%)` }}/>
        <div style={{ position:"absolute", bottom:-200, right:-200, width:500, height:500, borderRadius:"50%", background:`radial-gradient(circle, ${C.blue}08 0%, transparent 70%)` }}/>
      </div>

      <div style={{ width:420, display:"flex", flexDirection:"column", gap:24, position:"relative" }}>
        <div style={{ textAlign:"center", marginBottom:4 }}>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:16 }}>
            <div style={{ width:180 }} dangerouslySetInnerHTML={{ __html: VMI_LOGO.replace('width="841.89px" height="595.28px"','width="180" height="64"') }}/>
          </div>
          <div style={{ fontSize:11, color:C.yellow, fontWeight:700, letterSpacing:2.5, textTransform:"uppercase", marginBottom:4 }}>Portal MDM</div>
          <div style={{ fontSize:12, color:C.textMuted }}>Cadastro de Produtos — VMI Security</div>
        </div>

        {mode === "select" && (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {[
              { role:"solicitante", icon:"user", color:C.yellow, title:"Solicitante", sub:"Abrir nova solicitação de cadastro", action:()=>onLogin("solicitante") },
              { role:"mdm", icon:"list", color:C.blue, title:"Analista MDM", sub:"Análise e aprovação de solicitações", action:()=>setMode("mdm") },
              { role:"dev", icon:"wrench", color:C.purple, title:"Desenvolvedor", sub:"Acesso administrativo completo", action:()=>setMode("dev") },
            ].map(item=>(
              <button key={item.role} onClick={item.action}
                style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"18px 20px", cursor:"pointer", textAlign:"left", fontFamily:"'IBM Plex Sans',sans-serif", transition:"all .2s" }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor=item.color; e.currentTarget.style.transform="translateX(4px)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.transform="translateX(0)"; }}>
                <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                  <div style={{ width:42, height:42, borderRadius:10, background:`${item.color}15`, border:`1px solid ${item.color}40`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Icon name={item.icon} size={19} color={item.color}/>
                  </div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:14, color:item.role==="solicitante"?item.color:C.text }}>{item.title}</div>
                    <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>{item.sub}</div>
                  </div>
                  <div style={{ marginLeft:"auto" }}><Icon name="arrow" size={14} color={C.textMuted}/></div>
                </div>
              </button>
            ))}
          </div>
        )}

        {(mode==="mdm"||mode==="dev") && (
          <Card style={{ padding:"24px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20 }}>
              <button onClick={()=>{setMode("select");setUser("");setPass("");setError("");}}
                style={{ background:"none", border:"none", color:C.yellow, cursor:"pointer", display:"flex", alignItems:"center", gap:4, fontSize:12, padding:0 }}>
                <Icon name="back" size={13} color={C.yellow}/> Voltar
              </button>
              <span style={{ fontSize:14, fontWeight:700, color:C.text, marginLeft:4 }}>
                {mode==="mdm"?"Acesso MDM":"Acesso Desenvolvedor"}
              </span>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <Field label="Usuário" placeholder="seu.usuario" value={user} onChange={(e:any)=>{setUser(e.target.value);setError("");}}/>
              <Field label="Senha" type="password" placeholder="••••••••" value={pass} onChange={(e:any)=>{setPass(e.target.value);setError("");}}/>
              {error && <div style={{ padding:"10px 14px", background:C.redDim, border:`1px solid ${C.red}40`, borderRadius:6, color:C.red, fontSize:12, display:"flex", alignItems:"center", gap:6 }}><Icon name="alert" size={12} color={C.red}/>{error}</div>}
              <button onClick={()=>handle(mode==="mdm")} disabled={loading}
                style={{ background:C.yellow, border:"none", borderRadius:6, color:"#0C0F16", fontWeight:700, fontSize:14, padding:"12px", cursor:loading?"wait":"pointer", fontFamily:"'IBM Plex Sans',sans-serif", marginTop:4, display:"flex", alignItems:"center", justifyContent:"center", gap:8, opacity:loading?.8:1 }}>
                {loading?<><Spinner size={16}/> Verificando...</>:<><Icon name="lock" size={14} color="#0C0F16"/> Entrar</>}
              </button>
            </div>
          </Card>
        )}
        <div style={{ textAlign:"center", fontSize:10, color:C.textMuted }}>ICARO_DEV_TEST</div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// NOVA SOLICITAÇÃO
// ══════════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════════
// MODAL NOVO SOLICITANTE
// ══════════════════════════════════════════════════════════════════
function NovoSolicitanteModal({ onSave, onCancel }: any) {
  const [nome, setNome] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const handleSave = async () => {
    if (!nome.trim() || nome.trim().length < 3) { setErr("Nome deve ter ao menos 3 caracteres."); return; }
    setSaving(true);
    try {
      await insertSolicitante(nome.trim());
    } catch {
      // Se tabela não existir, salva só localmente
    }
    onSave(nome.trim());
    setSaving(false);
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.75)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, backdropFilter:"blur(4px)" }}>
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"28px 32px", maxWidth:380, width:"90%", boxShadow:"0 24px 64px rgba(0,0,0,.6)", animation:"fadeIn .15s ease" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:C.yellowDim, border:`1px solid ${C.yellowBorder}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="user" size={16} color={C.yellow}/>
          </div>
          <span style={{ fontWeight:700, fontSize:15, color:C.text }}>Novo Solicitante</span>
        </div>
        <Field label="Nome Completo" placeholder="Ex: João Silva" value={nome} onChange={(e:any)=>{ setNome(e.target.value); setErr(""); }}/>
        {err && <div style={{ marginTop:8, fontSize:12, color:C.red, display:"flex", alignItems:"center", gap:4 }}><Icon name="alert" size={12} color={C.red}/>{err}</div>}
        <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:20 }}>
          <button onClick={onCancel} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:6, color:C.textSub, fontSize:13, padding:"9px 18px", cursor:"pointer", fontFamily:"'IBM Plex Sans',sans-serif" }}>
            Cancelar
          </button>
          <button onClick={handleSave} disabled={saving}
            style={{ background:C.yellow, border:"none", borderRadius:6, color:"#0C0F16", fontSize:13, fontWeight:700, padding:"9px 18px", cursor:"pointer", fontFamily:"'IBM Plex Sans',sans-serif", display:"flex", alignItems:"center", gap:6, opacity:saving?.7:1 }}>
            {saving ? <Spinner size={14}/> : <Icon name="check" size={14} color="#0C0F16"/>}
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}

const SOLICITANTES_PADRAO = [
  "Icaro Batista","Heraldo Carvalho","Adriana Diniz","Willian Teixeira",
  "Ana Paula","Carlos Eduardo","Fernanda Lima","João Pedro","Maria Clara","Outros",
];

function NovaSolicitacao({ onCreated, onBack }: any) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [solNumero, setSolNumero] = useState("");
  const [planilha, setPlanilha] = useState<any[]>([]);
  const [solicitantes, setSolicitantes] = useState<string[]>(SOLICITANTES_PADRAO);
  const [solicitante, setSolicitante] = useState("");
  const [setor, setSetor] = useState("");
  const [prioridade, setPrioridade] = useState("Normal");
  const [urgente, setUrgente] = useState(false);
  const [motivoUrgencia, setMotivoUrgencia] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [items, setItems] = useState([emptyItem()]);
  const [showNovoSol, setShowNovoSol] = useState(false);

  // Quando prioridade = Urgente, ativa toggle
  useEffect(() => { if (prioridade === "Urgente") setUrgente(true); }, [prioridade]);

  useEffect(() => {
    fetchPlanilha().then(setPlanilha).catch(()=>{});
    fetchSolicitantesDB().then(data => {
      if (data?.length) setSolicitantes([...new Set([...SOLICITANTES_PADRAO, ...data.map((d:any)=>d.nome)])]);
    }).catch(()=>{});
  }, []);

  const updateItem = (idx: number, updated: any) => setItems(prev => prev.map((it,i)=>i===idx?updated:it));
  const removeItem = (idx: number) => { if (items.length > 1) setItems(prev => prev.filter((_,i)=>i!==idx)); };
  const addItem = () => setItems(prev => [...prev, emptyItem()]);

  const validate = () => {
    if (!solicitante) return "Selecione o solicitante.";
    if (!setor) return "Selecione o setor.";
    if (urgente && motivoUrgencia.trim().length < 10) return "Motivo da urgência deve ter ao menos 10 caracteres.";
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (!it.descricao || it.descricao.length > 90) return `Item ${i+1}: Descrição inválida (máx. 90 chars).`;
      if (!it.sigla) return `Item ${i+1}: Campo "Tipo" é obrigatório.`;
      if (!it.unidade) return `Item ${i+1}: Selecione a unidade.`;
      if (!it.ncm) return `Item ${i+1}: Preencha o NCM.`;
      if (!it.grupo) return `Item ${i+1}: Selecione o Grupo Protheus.`;
      if (it.sigla === "MP" && !it.prototipo && (!it.custo || it.custo === "")) return `Item ${i+1}: Custo obrigatório para MP não-protótipo.`;
      if (it.sigla === "MP" && !it.descricao) return `Item ${i+1}: Use o construtor automático para preencher a descrição do MP.`;
      if (it.grupo && it.grupo.match(/^3/) && !it.cod_mecanico) return `Item ${i+1}: Código mecânico obrigatório para grupos iniciados com 3.`;
      if (it.importado && !it.desc_ingles) return `Item ${i+1}: Descrição em inglês obrigatória para produto importado.`;
      if (it.cod_mecanico && it.sigla==="MP" && !it.cod_mecanico.startsWith("3"))
        return `Item ${i+1}: Código mecânico deve começar com 3.`;
    }
    return "";
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    if (!isConfigured()) { setError("Erro de configuração do Supabase."); return; }
    setSaving(true); setError("");
    try {
      const numero = genNumero();
      const payload = {
        numero, status:"Enviado", urgente, prioridade,
        solicitante, setor, observacoes,
        motivo_urgencia: urgente ? motivoUrgencia : "",
        descricao:items[0].descricao, tipo:items[0].sigla, unidade:items[0].unidade,
        fabricante:items[0].fabricante, modelo:items[0].modelo,
        desc_detalhada:items[0].desc_detalhada, ncm:items[0].ncm,
        grupo:items[0].grupo, armazem:items[0].armazem,
        importado:items[0].importado, kanban:items[0].kanban,
        prototipo:items[0].prototipo, chumbo:items[0].chumbo,
        control_scf:items[0].control_scf,
        custo:items[0].custo?parseFloat(items[0].custo):null,
        cod_mecanico:items[0].cod_mecanico,
        itens_extras:items.length>1?JSON.stringify(items.slice(1)):null,
        total_itens:items.length,
      };
      const [created] = await insertSolicitacao(payload);
      await insertHistorico({ solicitacao_id:created.id, acao:"Solicitação criada", usuario:solicitante, observacao:`${items.length} item(ns) — Setor: ${setor}` });
      await insertHistorico({ solicitacao_id:created.id, acao:"Status: Enviado", usuario:"Sistema", observacao:"Aguardando análise MDM" });
      setSolNumero(numero); setSubmitted(true); onCreated();
    } catch(e:any) { setError("Erro ao salvar: " + e.message); }
    setSaving(false);
  };

  if (submitted) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"60vh", gap:20, fontFamily:"'IBM Plex Sans',sans-serif" }}>
      <div style={{ width:72, height:72, borderRadius:"50%", background:C.greenDim, border:`2px solid ${C.green}`, display:"flex", alignItems:"center", justifyContent:"center", animation:"fadeIn .3s ease" }}>
        <Icon name="check" size={32} color={C.green}/>
      </div>
      <h2 style={{ margin:0, color:C.text, fontWeight:700, fontSize:22 }}>Solicitação Enviada!</h2>
      <div style={{ fontFamily:"monospace", color:C.yellow, fontSize:18, background:C.yellowDim, padding:"10px 24px", borderRadius:6, border:`1px solid ${C.yellowBorder}` }}>{solNumero}</div>
      <p style={{ color:C.textSub, textAlign:"center", maxWidth:380, lineHeight:1.6 }}>{items.length} item(ns) registrado(s). A equipe MDM será notificada.</p>
      <div style={{ display:"flex", gap:12 }}>
        <button onClick={()=>{setSubmitted(false);setItems([emptyItem()]);setSolicitante("");setSetor("");setUrgente(false);setMotivoUrgencia("");setObservacoes("");setPrioridade("Normal");}}
          style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:6, color:C.textSub, fontWeight:600, fontSize:13, padding:"11px 22px", cursor:"pointer", fontFamily:"'IBM Plex Sans',sans-serif" }}>
          Nova Solicitação
        </button>
        <button onClick={onBack} style={{ background:C.yellow, border:"none", borderRadius:6, color:"#0C0F16", fontWeight:700, fontSize:13, padding:"11px 22px", cursor:"pointer", fontFamily:"'IBM Plex Sans',sans-serif" }}>
          Início
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth:860, margin:"0 auto", fontFamily:"'IBM Plex Sans',sans-serif" }}>
      {showNovoSol && <NovoSolicitanteModal onSave={(nome:string)=>{ setSolicitantes(s=>[...s,nome]); setSolicitante(nome); setShowNovoSol(false); }} onCancel={()=>setShowNovoSol(false)}/>}

      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:11, color:C.textMuted, letterSpacing:1.5, textTransform:"uppercase", marginBottom:4 }}>Solicitação de Cadastro</div>
        <h1 style={{ margin:0, fontSize:24, fontWeight:700, color:C.text }}>Novo Produto</h1>
      </div>

      <Card style={{ padding:"22px 26px", marginBottom:20 }}>
        <SecHead icon="user" title="Identificação da Solicitação"/>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          {/* Solicitante com botão + Novo */}
          <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <label style={{ fontSize:11, fontWeight:600, color:C.textSub, letterSpacing:0.5, textTransform:"uppercase" }}>
                Solicitante<span style={{ color:C.yellow, marginLeft:3 }}>*</span>
              </label>
              <button onClick={()=>setShowNovoSol(true)}
                style={{ background:C.yellowDim, border:`1px solid ${C.yellowBorder}`, borderRadius:4, color:C.yellow, fontSize:11, cursor:"pointer", display:"flex", alignItems:"center", gap:4, padding:"3px 8px", fontFamily:"'IBM Plex Sans',sans-serif" }}>
                <Icon name="plus" size={11} color={C.yellow}/> Novo Solicitante
              </button>
            </div>
            <SearchSelect value={solicitante} onChange={setSolicitante} options={solicitantes} placeholder="Buscar solicitante..." required/>
          </div>

          <SearchSelect label="Setor Solicitante" value={setor} onChange={setSetor} options={SETORES_EMPRESA} placeholder="Buscar setor..." required/>

          <div>
            <Field label="Prioridade" type="select" value={prioridade} onChange={(e:any)=>setPrioridade(e.target.value)} options={["Normal","Alta","Urgente"]}/>
          </div>

          <div style={{ display:"flex", alignItems:"flex-end" }}>
            <div style={{ width:"100%", background:C.surfaceMid, borderRadius:8, padding:14, border:`1px solid ${urgente?C.red+"60":C.border}`, transition:"border-color .2s" }}>
              <Toggle label="🚨 Marcar como URGENTE" value={urgente} onChange={(v:boolean)=>{ setUrgente(v); if(v) setPrioridade("Urgente"); else setPrioridade("Normal"); }}/>
            </div>
          </div>

          {urgente && (
            <div style={{ gridColumn:"1/-1", animation:"fadeIn .2s ease" }}>
              <Field label="Motivo da Urgência (obrigatório — mín. 10 chars)" type="textarea"
                placeholder="Descreva o motivo que justifica a urgência desta solicitação..."
                value={motivoUrgencia} onChange={(e:any)=>setMotivoUrgencia(e.target.value)} required/>
              {motivoUrgencia.length > 0 && motivoUrgencia.length < 10 && (
                <div style={{ marginTop:4, fontSize:11, color:C.red }}>{10-motivoUrgencia.length} caracteres restantes para o mínimo</div>
              )}
            </div>
          )}

          <div style={{ gridColumn:"1/-1" }}>
            <Field label="Observações Gerais" type="textarea" placeholder="Informações adicionais..." value={observacoes} onChange={(e:any)=>setObservacoes(e.target.value)}/>
          </div>
        </div>
      </Card>

      {/* ITENS */}
      <div style={{ marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:C.text }}>Itens da Solicitação</div>
            <div style={{ fontSize:11, color:C.textMuted }}>{items.length} item(ns)</div>
          </div>
          <button onClick={addItem} style={{ background:C.yellowDim, border:`1px solid ${C.yellowBorder}`, borderRadius:6, color:C.yellow, fontWeight:700, fontSize:12, padding:"9px 18px", cursor:"pointer", fontFamily:"'IBM Plex Sans',sans-serif", display:"flex", alignItems:"center", gap:6, transition:"all .15s" }}
            onMouseEnter={e=>e.currentTarget.style.background=C.yellow+"30"} onMouseLeave={e=>e.currentTarget.style.background=C.yellowDim}>
            <Icon name="plus" size={13} color={C.yellow}/> Adicionar Item
          </button>
        </div>
        {items.map((item, idx) => (
          <ItemForm key={item.id} item={item} idx={idx} onChange={(u:any)=>updateItem(idx,u)} onRemove={()=>removeItem(idx)} planilha={planilha}/>
        ))}
      </div>

      {error && <div style={{ padding:"12px 16px", background:C.redDim, border:`1px solid ${C.red}40`, borderRadius:8, color:C.red, fontSize:13, marginBottom:16, display:"flex", alignItems:"center", gap:8 }}><Icon name="alert" size={14} color={C.red}/>{error}</div>}

      <div style={{ display:"flex", justifyContent:"space-between" }}>
        <button onClick={onBack} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:6, color:C.textSub, fontWeight:600, fontSize:13, padding:"11px 22px", cursor:"pointer", fontFamily:"'IBM Plex Sans',sans-serif" }}>Cancelar</button>
        <button onClick={handleSubmit} disabled={saving}
          style={{ background:saving?C.border:C.yellow, border:"none", borderRadius:6, color:"#0C0F16", fontWeight:700, fontSize:13, padding:"11px 22px", cursor:saving?"wait":"pointer", fontFamily:"'IBM Plex Sans',sans-serif", display:"flex", alignItems:"center", gap:8, transition:"all .2s" }}>
          {saving?<><Spinner size={14}/> Salvando...</>:<><Icon name="send" size={13} color="#0C0F16"/> Enviar ({items.length} item(ns))</>}
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════════════════════════════
function Dashboard({ sols, loading, setView }: any) {
  const kpis = [
    { label:"Pendentes",      v:sols.filter((s:any)=>["Enviado","Em análise MDM"].includes(s.status)).length, color:C.blue,   icon:"clock"   },
    { label:"Em Análise",     v:sols.filter((s:any)=>s.status==="Em análise MDM").length,                    color:C.yellow, icon:"search"  },
    { label:"Aprovados",      v:sols.filter((s:any)=>s.status==="Aprovado").length,                          color:C.green,  icon:"check"   },
    { label:"SLA Crítico",    v:sols.filter((s:any)=>calcSLA(s.created_at)>=22).length,                      color:C.red,    icon:"alert"   },
    { label:"Aguard. Ajuste", v:sols.filter((s:any)=>s.status==="Aguardando Ajuste").length,                 color:C.orange, icon:"tag"     },
    { label:"Total",          v:sols.length,                                                                  color:C.purple, icon:"chart"   },
  ];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
      <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between" }}>
        <div>
          <div style={{ fontSize:11, color:C.textMuted, letterSpacing:1.5, textTransform:"uppercase", marginBottom:5 }}>Visão Geral</div>
          <h1 style={{ margin:0, fontSize:26, fontWeight:700, color:C.text }}>Dashboard <span style={{color:C.yellow}}>MDM</span></h1>
        </div>
        <button onClick={()=>setView("fila")} style={{ background:C.yellow, border:"none", borderRadius:6, color:"#0C0F16", fontWeight:700, fontSize:13, padding:"10px 20px", cursor:"pointer", fontFamily:"'IBM Plex Sans',sans-serif", display:"flex", alignItems:"center", gap:8 }}>
          <Icon name="list" size={14} color="#0C0F16"/> Ver Fila
        </button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
        {kpis.map((k,i)=>(
          <div key={k.label} style={{ background:C.surface, border:`1px solid ${C.border}`, borderLeft:`3px solid ${k.color}`, borderRadius:10, padding:"18px 20px", boxShadow:"0 2px 8px rgba(0,0,0,.2)", transition:"transform .2s", animation:`fadeIn .${3+i}s ease` }}
            onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div style={{ fontSize:11, color:C.textMuted, letterSpacing:.5, textTransform:"uppercase", marginBottom:8 }}>{k.label}</div>
                <div style={{ fontSize:32, fontWeight:700, color:k.color, lineHeight:1 }}>{loading?<Spinner/>:k.v}</div>
              </div>
              <div style={{ opacity:.4 }}><Icon name={k.icon} size={22} color={k.color}/></div>
            </div>
          </div>
        ))}
      </div>
      <Card style={{ padding:0, overflow:"hidden" }}>
        <div style={{ padding:"14px 20px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontWeight:700, fontSize:14, color:C.text }}>Últimas Solicitações</span>
          <button onClick={()=>setView("fila")} style={{ background:"none", border:"none", color:C.yellow, cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", gap:4, fontFamily:"'IBM Plex Sans',sans-serif" }}>Ver fila <Icon name="arrow" size={12} color={C.yellow}/></button>
        </div>
        {loading?<div style={{ padding:40, display:"flex", justifyContent:"center" }}><Spinner/></div>
          :sols.length===0?<Empty msg="Nenhuma solicitação ainda."/>
          :sols.slice(0,8).map((s:any,i:number)=>(
            <div key={s.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 20px", borderBottom:i<7?`1px solid ${C.border}`:"none", transition:"background .15s" }}
              onMouseEnter={e=>e.currentTarget.style.background=C.surfaceMid} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              {s.urgente&&<span style={{ width:7, height:7, borderRadius:"50%", background:C.red, display:"inline-block", flexShrink:0 }}/>}
              <span style={{ fontFamily:"monospace", fontSize:11, color:C.yellow, minWidth:90 }}>{s.numero}</span>
              <span style={{ flex:1, fontSize:13, color:C.text, fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.descricao}</span>
              {s.total_itens>1&&<span style={{ fontSize:10, color:C.purple, background:C.purpleDim, border:`1px solid ${C.purple}30`, borderRadius:4, padding:"1px 7px", fontWeight:700 }}>{s.total_itens}i</span>}
              <StatusTag status={s.status}/>
            </div>
          ))
        }
      </Card>
      <Card style={{ padding:"20px 22px" }}>
        <div style={{ fontSize:11, color:C.textMuted, letterSpacing:1, textTransform:"uppercase", marginBottom:16 }}>Equipe MDM</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12 }}>
          {EQUIPE.map(m=>(
            <div key={m.name} style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:34, height:34, borderRadius:"50%", background:C.yellowDim, border:`1px solid ${C.yellowBorder}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:C.yellow, flexShrink:0 }}>{m.initials}</div>
              <div>
                <div style={{ fontSize:12, color:C.text, fontWeight:600 }}>{m.name}</div>
                <div style={{ fontSize:10, color:C.textMuted }}>{m.role}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// DETALHE / ANÁLISE MDM
// ══════════════════════════════════════════════════════════════════
function InfoCell({ label, val, mono=false, wide=false, highlight="" }: any) {
  return (
    <div style={{ padding:"10px 13px", background:C.surfaceMid, borderRadius:6, border:`1px solid ${C.border}`, gridColumn:wide?"1/-1":"auto" }}>
      <div style={{ fontSize:10, color:C.textMuted, textTransform:"uppercase", letterSpacing:.5, marginBottom:4 }}>{label}</div>
      <div style={{ fontSize:13, color:highlight||C.text, fontFamily:mono?"monospace":"inherit", wordBreak:"break-word", fontWeight:highlight?600:400 }}>{val||"—"}</div>
    </div>
  );
}

function ItemExpandivel({ it, idx, solId, onSaved, role }: { it:any, idx:number, solId?:string, onSaved?:()=>void, role?:string }) {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [data, setData] = useState<any>({...it});
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!solId) return;
    setSaving(true);
    try {
      // Itens extras são salvos dentro do JSON itens_extras da solicitação pai
      // Buscamos a solicitação, atualizamos o item e salvamos de volta
      const res = await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/solicitacoes?id=eq.${solId}&select=itens_extras`, { headers: sbHeaders() });
      const rows = await res.json();
      if (rows?.[0]) {
        let extras: any[] = [];
        try { extras = JSON.parse(rows[0].itens_extras || "[]"); } catch {}
        // idx 0 = item principal (não editado aqui), idx > 0 = extra (índice extras[idx-1])
        if (idx > 0) extras[idx - 1] = { ...data };
        await updateSolicitacao(solId, { itens_extras: JSON.stringify(extras) });
      }
      setEditMode(false);
      if (onSaved) onSaved();
    } catch(e:any) { alert("Erro ao salvar: " + e.message); }
    setSaving(false);
  };

  return (
    <div style={{ border:`1px solid ${editMode?C.blue:C.border}`, borderRadius:8, overflow:"hidden", marginBottom:10, transition:"border-color .2s" }}>
      <div onClick={()=>{ if(!editMode) setOpen(!open); }} style={{ background:C.surfaceMid, padding:"12px 16px", display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}>
        <div style={{ width:24, height:24, borderRadius:6, background:C.yellowDim, border:`1px solid ${C.yellowBorder}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:C.yellow, flexShrink:0 }}>{idx+1}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:13, fontWeight:600, color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{data.descricao||"Item sem descrição"}</div>
          <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>{[data.sigla,data.unidade,data.ncm].filter(Boolean).join(" · ")}</div>
        </div>
        {data.sigla&&<span style={{ background:C.yellowDim, color:C.yellow, border:`1px solid ${C.yellowBorder}`, borderRadius:4, fontSize:10, fontWeight:700, padding:"2px 8px", flexShrink:0 }}>{data.sigla}</span>}
        {(role==="mdm"||role==="dev") && idx > 0 && !editMode && (
          <button onClick={e=>{e.stopPropagation();setOpen(true);setEditMode(true);}}
            style={{ background:C.blueDim, border:`1px solid ${C.blue}30`, color:C.blue, borderRadius:4, fontSize:11, padding:"3px 8px", cursor:"pointer", fontFamily:"'IBM Plex Sans',sans-serif", flexShrink:0 }}>
            Editar
          </button>
        )}
        <Icon name={open?"chevron_up":"chevron_down"} size={14} color={C.textMuted}/>
      </div>

      {open && !editMode && (
        <div style={{ padding:16, display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
          <InfoCell label="Descrição" val={data.descricao} wide/>
          <InfoCell label="Tipo" val={data.sigla}/>
          <InfoCell label="Unidade" val={data.unidade}/>
          <InfoCell label="NCM" val={data.ncm}/>
          <InfoCell label="Grupo Protheus" val={data.grupo} wide/>
          <InfoCell label="Fabricante" val={data.fabricante}/>
          <InfoCell label="Modelo" val={data.modelo}/>
          <InfoCell label="Custo Est." val={data.custo?`R$ ${data.custo}`:""}/>
          <InfoCell label="Cod. Mecânico" val={data.cod_mecanico}/>
          <InfoCell label="Armazém" val={data.armazem}/>
          {data.desc_ingles&&<InfoCell label="Descrição em Inglês" val={data.desc_ingles} wide/>}
          {data.desc_detalhada&&<InfoCell label="Descrição Técnica" val={data.desc_detalhada} wide/>}
          <div style={{ gridColumn:"1/-1", display:"flex", flexWrap:"wrap", gap:8, marginTop:4 }}>
            {[
              {label:"Importado",  val:data.importado},
              {label:"Kanban",     val:data.kanban},
              {label:"Protótipo",  val:data.prototipo},
              {label:"Chumbo/RoHS",val:data.chumbo},
              {label:"Control SCF",val:data.control_scf},
            ].map((a:any)=>(
              <span key={a.label} style={{ fontSize:11, padding:"3px 10px", borderRadius:4, background:a.val?C.yellowDim:C.bg, border:`1px solid ${a.val?C.yellowBorder:C.border}`, color:a.val?C.yellow:C.textMuted }}>
                {a.label}: {a.val?"Sim":"Não"}
              </span>
            ))}
          </div>
        </div>
      )}

      {open && editMode && (
        <div style={{ padding:16 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
            <div style={{ gridColumn:"1/-1" }}>
              <Field label="Descrição" value={data.descricao} onChange={(e:any)=>setData((d:any)=>({...d,descricao:e.target.value}))} maxLen={90}/>
            </div>
            <Field label="Tipo" type="select" value={data.sigla||""} onChange={(e:any)=>setData((d:any)=>({...d,sigla:e.target.value}))} options={SIGLAS.map(s=>({value:s.value,label:s.label}))}/>
            <SearchSelect label="Unidade" value={data.unidade||""} onChange={(v:string)=>setData((d:any)=>({...d,unidade:v}))} options={UNIDADES} placeholder="Unidade..."/>
            <div>
              <label style={{ fontSize:11, fontWeight:600, color:C.textSub, letterSpacing:0.5, textTransform:"uppercase", display:"block", marginBottom:5 }}>NCM<span style={{ color:C.yellow, marginLeft:3 }}>*</span></label>
              <input placeholder="0000.00.00" value={data.ncm||""} maxLength={10} inputMode="numeric"
                onChange={e=>{
                  const raw=e.target.value.replace(/[^0-9]/g,"").slice(0,8);
                  let m=raw;
                  if(raw.length>4) m=raw.slice(0,4)+"."+raw.slice(4);
                  if(raw.length>6) m=raw.slice(0,4)+"."+raw.slice(4,6)+"."+raw.slice(6);
                  setData((d:any)=>({...d,ncm:m}));
                }} style={iS}/>
            </div>
            <SearchSelect label="Grupo Protheus" value={data.grupo||""} onChange={(v:string)=>setData((d:any)=>({...d,grupo:v}))} options={GRUPOS_PROTHEUS_ITENS} placeholder="Grupo..."/>
            <Field label="Fabricante" value={data.fabricante||""} onChange={(e:any)=>setData((d:any)=>({...d,fabricante:e.target.value}))} placeholder="Ex: WEG, ABB..."/>
            <Field label="Modelo" value={data.modelo||""} onChange={(e:any)=>setData((d:any)=>({...d,modelo:e.target.value}))} placeholder="Ex: CFW500..."/>
            <Field label="Custo Est. (R$)" value={data.custo||""} onChange={(e:any)=>setData((d:any)=>({...d,custo:e.target.value}))} placeholder="0,00"/>
            <Field label="Cod. Mecânico" value={data.cod_mecanico||""} onChange={(e:any)=>setData((d:any)=>({...d,cod_mecanico:e.target.value}))} placeholder="Ex: 33.22.11111.00"/>
            <div style={{ gridColumn:"1/-1" }}>
              <Field label="Descrição Técnica" type="textarea" value={data.desc_detalhada||""} onChange={(e:any)=>setData((d:any)=>({...d,desc_detalhada:e.target.value}))} placeholder="Características técnicas..."/>
            </div>
            {data.importado && (
              <div style={{ gridColumn:"1/-1" }}>
                <Field label="Descrição em Inglês" value={data.desc_ingles||""} onChange={(e:any)=>setData((d:any)=>({...d,desc_ingles:e.target.value}))} placeholder="English description..." required/>
              </div>
            )}
            <div style={{ gridColumn:"1/-1", background:C.surfaceMid, borderRadius:6, padding:14, border:`1px solid ${C.border}`, display:"flex", flexDirection:"column", gap:10 }}>
              {[
                {key:"importado",   label:"Produto Importado"},
                {key:"kanban",      label:"Controle Kanban"},
                {key:"prototipo",   label:"Protótipo"},
                {key:"chumbo",      label:"Contém Chumbo (RoHS)"},
                {key:"control_scf", label:"Control SCF"},
              ].map((f,fi)=>(
                <div key={f.key}>
                  {fi>0&&<div style={{ height:1, background:C.border, marginBottom:10 }}/>}
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <span style={{ fontSize:13, color:C.textSub }}>{f.label}</span>
                    <div onClick={()=>setData((d:any)=>({...d,[f.key]:!d[f.key]}))}
                      style={{ width:38, height:22, borderRadius:11, cursor:"pointer", background:data[f.key]?C.yellow:C.border, position:"relative", transition:"background .2s", flexShrink:0 }}>
                      <div style={{ position:"absolute", top:3, left:data[f.key]?19:3, width:16, height:16, borderRadius:"50%", background:"#fff", transition:"left .2s" }}/>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"flex-end", gap:8 }}>
            <button onClick={()=>{setEditMode(false);setData({...it});}} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:6, color:C.textSub, fontSize:12, padding:"9px 16px", cursor:"pointer", fontFamily:"'IBM Plex Sans',sans-serif" }}>Cancelar</button>
            <button onClick={handleSave} disabled={saving} style={{ background:C.blue, border:"none", borderRadius:6, color:"#fff", fontSize:12, fontWeight:700, padding:"9px 16px", cursor:"pointer", fontFamily:"'IBM Plex Sans',sans-serif", display:"flex", alignItems:"center", gap:6 }}>
              {saving?<Spinner size={12}/>:<Icon name="check" size={12} color="#fff"/>} Salvar Item
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Detalhe({ sol, onBack, onUpdate, role }: any) {
  const [hist, setHist] = useState<any[]>([]);
  const [status, setStatus] = useState(sol.status);
  const [responsavel, setResponsavel] = useState(sol.responsavel||"");
  const [obs, setObs] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadHist, setLoadHist] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<any>({...sol});
  const [exporting, setExporting] = useState(false);

  useEffect(()=>{
    if(!isConfigured()){ setLoadHist(false); return; }
    fetchHistorico(sol.id).then((h:any)=>{ setHist(h); setLoadHist(false); });
  },[sol.id]);

  const ACOES = [
    { label:"✓ Aprovar",           ns:"Aprovado",              c:C.green,  bg:C.greenDim  },
    { label:"✕ Reprovar",          ns:"Reprovado",             c:C.red,    bg:C.redDim    },
    { label:"⟳ Solicitar Ajuste",  ns:"Aguardando Ajuste",     c:C.orange, bg:C.orangeDim },
    { label:"↗ Integrar Protheus", ns:"Integrado no Protheus", c:C.purple, bg:C.purpleDim },
    { label:"✓ Finalizado",        ns:"Finalizado",            c:C.textSub,bg:"#8B96B018" },
  ];

  const handleAcao = async (a: any) => {
    setSaving(true);
    try {
      await updateSolicitacao(sol.id, { status:a.ns, responsavel:responsavel||null });
      await insertHistorico({ solicitacao_id:sol.id, acao:a.ns, usuario:responsavel||"Analista MDM", observacao:obs });
      setStatus(a.ns);
      setHist((h:any)=>[...h,{ acao:a.ns, usuario:responsavel||"Analista MDM", observacao:obs, created_at:new Date().toISOString() }]);
      setObs(""); onUpdate();
    } catch(e:any) { alert("Erro: "+e.message); }
    setSaving(false);
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      await updateSolicitacao(sol.id, editData);
      await insertHistorico({ solicitacao_id:sol.id, acao:"Dados editados", usuario:responsavel||"MDM", observacao:"Edição manual dos campos" });
      setEditMode(false); onUpdate();
    } catch(e:any) { alert("Erro: "+e.message); }
    setSaving(false);
  };

  const handleExport = () => {
    setExporting(true);
    try {
      // Monta lista completa com item principal + extras
      const itensExtrasArr = sol.itens_extras ? (() => { try { return JSON.parse(sol.itens_extras); } catch { return []; } })() : [];
      const todosItens = [{ ...sol }, ...itensExtrasArr];
      const headers = ["Número","Status","Solicitante","Setor","Prioridade","Urgente","Motivo Urgência",
        "Descrição","Tipo","Unidade","NCM","Grupo Protheus","Armazém","Custo Est.",
        "Fabricante","Modelo","Cod. Mecânico","Descrição Técnica",
        "Importado","Kanban","Protótipo","Chumbo/RoHS","Control SCF","Observações","Criado em"];
      const rows = todosItens.map((it:any) => [
        sol.numero||"", sol.status||"", sol.solicitante||"", sol.setor||"",
        sol.prioridade||"Normal", sol.urgente?"Sim":"Não", sol.motivo_urgencia||"",
        it.descricao||"", it.sigla||it.tipo||"", it.unidade||"",
        it.ncm||"", it.grupo||"", it.armazem||sol.armazem||"",
        it.custo!=null?String(it.custo):"",
        it.fabricante||"", it.modelo||"", it.cod_mecanico||"", it.desc_detalhada||"",
        it.importado?"Sim":"Não", it.kanban?"Sim":"Não",
        it.prototipo?"Sim":"Não", it.chumbo?"Sim":"Não", it.control_scf?"Sim":"Não",
        sol.observacoes||"", fmtDate(sol.created_at),
      ]);
      const nome = sol.solicitante
        ? `SOLICITACAO_${sol.solicitante.toUpperCase().replace(/\s+/g,"_")}.xls`
        : `MDM_SOLICITACAO_${sol.numero||"EXPORT"}.xls`;
      const xml = buildXmlXlsx(headers, rows);
      downloadXlsx(xml, nome);
    } catch(e:any) { alert("Erro ao exportar: "+e); }
    setTimeout(()=>setExporting(false), 1000);
  };

  const itensExtras = sol.itens_extras ? (() => { try { return JSON.parse(sol.itens_extras); } catch { return []; } })() : [];
  const slaH = calcSLA(sol.created_at);
  const slaC = slaColor(slaH);
  const todosItens = [{ ...sol, _isMain:true }, ...itensExtras];

  return (
    <div style={{ animation:"fadeIn .2s ease" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, flexWrap:"wrap", gap:10 }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:C.yellow, cursor:"pointer", fontSize:13, display:"flex", alignItems:"center", gap:6, padding:0, fontFamily:"'IBM Plex Sans',sans-serif" }}>
          <Icon name="back" size={14} color={C.yellow}/> Voltar à Fila
        </button>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={handleExport} disabled={exporting}
            style={{ background:exporting?C.yellowDim:C.surface, border:`1px solid ${exporting?C.yellow:C.border}`, borderRadius:6, color:exporting?C.yellow:C.textSub, fontSize:12, padding:"8px 14px", cursor:"pointer", display:"flex", alignItems:"center", gap:6, fontFamily:"'IBM Plex Sans',sans-serif", transition:"all .2s" }}>
            {exporting?<><Spinner size={12}/> Convertendo...</>:<><Icon name="download" size={12} color={C.textSub}/> Converter em Planilha</>}
          </button>
          {(role==="mdm"||role==="dev") && !editMode && (
            <button onClick={()=>setEditMode(true)} style={{ background:C.blueDim, border:`1px solid ${C.blue}40`, borderRadius:6, color:C.blue, fontSize:12, padding:"8px 14px", cursor:"pointer", display:"flex", alignItems:"center", gap:6, fontFamily:"'IBM Plex Sans',sans-serif" }}>
              <Icon name="edit" size={13} color={C.blue}/> Editar
            </button>
          )}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:20 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

          {/* ── CABEÇALHO DA SOLICITAÇÃO ─────────────────────── */}
          <Card style={{ padding:"20px 24px" }}>
            <div style={{ fontFamily:"monospace", fontSize:12, color:C.yellow, marginBottom:4 }}>{sol.numero}</div>
            <h2 style={{ margin:"0 0 12px", fontSize:18, fontWeight:700, color:C.text }}>{sol.descricao}</h2>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:18 }}>
              <StatusTag status={status}/>
              <PrioTag label={sol.prioridade||"Normal"}/>
              {sol.urgente&&<span style={{ background:C.redDim, color:C.red, border:`1px solid ${C.red}30`, borderRadius:4, fontSize:10, fontWeight:700, padding:"2px 8px", textTransform:"uppercase" }}>URGENTE</span>}
              {todosItens.length>1&&<span style={{ background:C.purpleDim, color:C.purple, border:`1px solid ${C.purple}30`, borderRadius:4, fontSize:10, fontWeight:700, padding:"2px 8px" }}>{todosItens.length} ITENS</span>}
            </div>

            {editMode ? (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Descrição" value={editData.descricao} onChange={(e:any)=>setEditData((d:any)=>({...d,descricao:e.target.value}))} maxLen={90}/>
                <Field label="Tipo" type="select" value={editData.tipo} onChange={(e:any)=>setEditData((d:any)=>({...d,tipo:e.target.value}))} options={SIGLAS.map(s=>({value:s.value,label:s.label}))}/>
                <SearchSelect label="Unidade" value={editData.unidade} onChange={(v:string)=>setEditData((d:any)=>({...d,unidade:v}))} options={UNIDADES} placeholder="Unidade..."/>
                <Field label="NCM" value={editData.ncm} onChange={(e:any)=>setEditData((d:any)=>({...d,ncm:e.target.value}))}/>
                <SearchSelect label="Grupo Protheus" value={editData.grupo} onChange={(v:string)=>setEditData((d:any)=>({...d,grupo:v}))} options={GRUPOS_PROTHEUS_ITENS} placeholder="Grupo..."/>
                <Field label="Armazém" placeholder="Ex: 01 – Almoxarifado Geral" value={editData.armazem||""} onChange={(e:any)=>setEditData((d:any)=>({...d,armazem:e.target.value}))}/>
                <Field label="Custo Estimado" type="number" value={editData.custo||""} onChange={(e:any)=>setEditData((d:any)=>({...d,custo:e.target.value}))}/>
                <Field label="Cod. Mecânico" value={editData.cod_mecanico||""} onChange={(e:any)=>setEditData((d:any)=>({...d,cod_mecanico:e.target.value}))}/>
                <div style={{ gridColumn:"1/-1", display:"flex", gap:8, justifyContent:"flex-end" }}>
                  <button onClick={()=>setEditMode(false)} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:6, color:C.textSub, fontSize:12, padding:"9px 16px", cursor:"pointer", fontFamily:"'IBM Plex Sans',sans-serif" }}>Cancelar</button>
                  <button onClick={handleSaveEdit} disabled={saving} style={{ background:C.blue, border:"none", borderRadius:6, color:"#fff", fontSize:12, fontWeight:700, padding:"9px 16px", cursor:"pointer", fontFamily:"'IBM Plex Sans',sans-serif", display:"flex", alignItems:"center", gap:6 }}>
                    {saving?<Spinner size={12}/>:<Icon name="check" size={12} color="#fff"/>} Salvar
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
                <InfoCell label="Solicitante"  val={sol.solicitante}/>
                <InfoCell label="Setor"        val={sol.setor}/>
                <InfoCell label="Criado em"    val={fmtDate(sol.created_at)} mono/>
                <InfoCell label="Tipo"         val={sol.tipo}/>
                <InfoCell label="Unidade"      val={sol.unidade}/>
                <InfoCell label="NCM"          val={sol.ncm}/>
                <InfoCell label="Grupo Protheus" val={sol.grupo} wide/>
                <InfoCell label="Armazém"      val={sol.armazem}/>
                <InfoCell label="Custo Est."   val={sol.custo?`R$ ${sol.custo}`:""}/>
                <InfoCell label="Fabricante"   val={sol.fabricante}/>
                <InfoCell label="Modelo"       val={sol.modelo}/>
                <InfoCell label="Cod. Mecânico" val={sol.cod_mecanico}/>
                {sol.desc_detalhada&&<InfoCell label="Descrição Técnica" val={sol.desc_detalhada} wide/>}
              </div>
            )}

            {/* Flags booleanas */}
            {!editMode && (
              <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:14 }}>
                {[
                  {label:"Importado",  val:sol.importado},
                  {label:"Kanban",     val:sol.kanban},
                  {label:"Protótipo",  val:sol.prototipo},
                  {label:"Chumbo/RoHS",val:sol.chumbo},
                  {label:"Control SCF",val:sol.control_scf},
                ].map((a:any)=>(
                  <span key={a.label} style={{ fontSize:11, padding:"4px 10px", borderRadius:4, background:a.val?C.yellowDim:C.bg, border:`1px solid ${a.val?C.yellowBorder:C.border}`, color:a.val?C.yellow:C.textMuted }}>
                    {a.label}: <strong>{a.val?"Sim":"Não"}</strong>
                  </span>
                ))}
              </div>
            )}

            {sol.motivo_urgencia&&(
              <div style={{ marginTop:14, padding:"12px 14px", background:C.redDim, borderRadius:6, border:`1px solid ${C.red}30` }}>
                <div style={{ fontSize:10, color:C.red, textTransform:"uppercase", marginBottom:4, fontWeight:700 }}>🚨 Motivo da Urgência</div>
                <div style={{ fontSize:13, color:C.text }}>{sol.motivo_urgencia}</div>
              </div>
            )}
            {sol.observacoes&&(
              <div style={{ marginTop:10, padding:"12px 14px", background:C.surfaceMid, borderRadius:6, border:`1px solid ${C.border}` }}>
                <div style={{ fontSize:10, color:C.textMuted, textTransform:"uppercase", marginBottom:4 }}>Observações Gerais</div>
                <div style={{ fontSize:13, color:C.textSub }}>{sol.observacoes}</div>
              </div>
            )}
          </Card>

          {/* ── TODOS OS ITENS (expansíveis) ─────────────────── */}
          <Card style={{ padding:"20px 24px" }}>
            <SecHead icon="box" title={`Itens da Solicitação (${todosItens.length})`}/>
            {todosItens.map((it:any, i:number) => (
              <ItemExpandivel key={i} it={it} idx={i} solId={sol.id} onSaved={onUpdate} role={role}/>
            ))}
          </Card>

          {/* ── HISTÓRICO ────────────────────────────────────── */}
          <Card style={{ padding:"20px 24px" }}>
            <SecHead icon="clock" title="Histórico de Auditoria"/>
            {loadHist?<div style={{ display:"flex", justifyContent:"center", padding:20 }}><Spinner/></div>
              :hist.length===0?<div style={{ fontSize:12, color:C.textMuted }}>Sem histórico registrado.</div>
              :<div style={{ position:"relative" }}>
                <div style={{ position:"absolute", left:7, top:0, bottom:0, width:1, background:C.border }}/>
                {hist.map((h:any,i:number)=>(
                  <div key={i} style={{ display:"flex", gap:16, marginBottom:16, paddingLeft:22, position:"relative" }}>
                    <div style={{ position:"absolute", left:2, top:4, width:10, height:10, borderRadius:"50%", background:C.yellow, border:`2px solid ${C.bg}` }}/>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", gap:4, flexWrap:"wrap" }}>
                        <span style={{ fontSize:13, color:C.text, fontWeight:600 }}>{h.acao}</span>
                        <span style={{ fontFamily:"monospace", fontSize:10, color:C.textMuted }}>{fmtDate(h.created_at)}</span>
                      </div>
                      <div style={{ fontSize:11, color:C.textSub }}>por {h.usuario}</div>
                      {h.observacao&&<div style={{ fontSize:11, color:C.textMuted, marginTop:3 }}>{h.observacao}</div>}
                    </div>
                  </div>
                ))}
              </div>
            }
          </Card>
        </div>

        {/* ── PAINEL LATERAL ───────────────────────────────── */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Card style={{ padding:"20px" }}>
            <div style={{ fontSize:11, color:C.textMuted, letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>Responsável / Analista</div>
            {sol.responsavel && sol.responsavel !== (responsavel||"") && role !== "dev" ? (
              <div style={{ padding:"10px 12px", background:C.orangeDim, border:`1px solid ${C.orange}40`, borderRadius:6, marginBottom:10 }}>
                <div style={{ fontSize:11, color:C.orange, fontWeight:700 }}>🔒 Em análise por:</div>
                <div style={{ fontSize:13, color:C.text, marginTop:2 }}>{sol.responsavel}</div>
                {role === "dev" && <div style={{ fontSize:10, color:C.textMuted, marginTop:4 }}>DEV pode reatribuir abaixo</div>}
              </div>
            ) : null}
            {(!sol.responsavel || role === "dev") ? (
              <select value={responsavel} onChange={e=>setResponsavel(e.target.value)} style={{...iS,cursor:"pointer",marginBottom:10}}>
                <option value="">— Não atribuído —</option>
                {EQUIPE.map(m=><option key={m.name} value={m.name}>{m.name}</option>)}
              </select>
            ) : (
              <div style={{ marginBottom:10 }}>
                <select value={responsavel} onChange={e=>setResponsavel(e.target.value)} style={{...iS,cursor:"pointer",opacity:0.6}} disabled={role==="mdm" && !!sol.responsavel}>
                  <option value="">— Não atribuído —</option>
                  {EQUIPE.map(m=><option key={m.name} value={m.name}>{m.name}</option>)}
                </select>
              </div>
            )}
            {!sol.responsavel && !responsavel && (
              <button onClick={async()=>{
                const me = EQUIPE.find(e=>e.name.toLowerCase().replace(/\s/g,".")==="icaro.batista") || EQUIPE[0];
                setResponsavel(me.name);
                await updateSolicitacao(sol.id,{responsavel:me.name});
                onUpdate();
              }} style={{ width:"100%", background:C.yellowDim, border:`1px solid ${C.yellowBorder}`, borderRadius:6, color:C.yellow, fontSize:12, fontWeight:700, padding:"9px", cursor:"pointer", marginBottom:10, fontFamily:"'IBM Plex Sans',sans-serif" }}>
                ✋ Assumir esta Solicitação
              </button>
            )}
            <div style={{ fontSize:11, color:C.textMuted, letterSpacing:1, textTransform:"uppercase", marginBottom:10 }}>Ações MDM</div>
            <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
              {ACOES.map(a=>(
                <button key={a.label} onClick={()=>handleAcao(a)} disabled={saving}
                  style={{ background:a.bg, border:`1px solid ${a.c}35`, color:a.c, borderRadius:6, padding:"10px 14px", cursor:saving?"wait":"pointer", fontSize:12, fontWeight:600, textAlign:"left", fontFamily:"'IBM Plex Sans',sans-serif", transition:"all .15s", opacity:saving?.5:1 }}
                  onMouseEnter={e=>{ if(!saving){ e.currentTarget.style.transform="translateX(3px)"; e.currentTarget.style.borderColor=a.c; }}}
                  onMouseLeave={e=>{ e.currentTarget.style.transform="translateX(0)"; e.currentTarget.style.borderColor=`${a.c}35`; }}>
                  {a.label}
                </button>
              ))}
            </div>
            <div style={{ marginTop:14 }}>
              <div style={{ fontSize:11, color:C.textMuted, marginBottom:6 }}>Obs. para o histórico</div>
              <textarea rows={3} placeholder="Justificativa, instrução de ajuste..." value={obs} onChange={e=>setObs(e.target.value)} style={{...iS,resize:"vertical" as any}}/>
            </div>
          </Card>

          <Card style={{ padding:"18px" }}>
            <div style={{ fontSize:11, color:C.textMuted, letterSpacing:1, textTransform:"uppercase", marginBottom:10 }}>SLA — Tempo Decorrido</div>
            <div style={{ height:6, background:C.border, borderRadius:3, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${Math.min((slaH/48)*100,100)}%`, background:slaC, borderRadius:3, transition:"width .5s" }}/>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
              <span style={{ fontSize:11, color:slaC, fontWeight:600 }}>{slaH}h decorridas</span>
              <span style={{ fontSize:11, color:C.textMuted }}>{Math.round((slaH/48)*100)}% (48h)</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// FILA MDM
// ══════════════════════════════════════════════════════════════════
function FilaMDM({ sols, loading, onRefresh, role, title="Fila de Atendimento" }: any) {
  const [search, setSearch] = useState("");
  const [fStatus, setFStatus] = useState("Todos");
  const [fSetor, setFSetor] = useState("Todos");
  const [sel, setSel] = useState<any>(null);
  const [exporting, setExporting] = useState(false);

  const statuses = ["Todos",...Object.keys(STATUS_CFG)];
  const setores = ["Todos",...Array.from(new Set(sols.map((s:any)=>s.setor).filter(Boolean))) as string[]];
  const filtered = sols.filter((s:any)=>
    (fStatus==="Todos"||s.status===fStatus)&&
    (fSetor==="Todos"||s.setor===fSetor)&&
    (s.descricao?.toLowerCase().includes(search.toLowerCase())||s.numero?.includes(search)||s.solicitante?.toLowerCase().includes(search.toLowerCase()))
  );

  if (sel) return <Detalhe sol={sel} onBack={()=>{setSel(null);onRefresh();}} onUpdate={onRefresh} role={role}/>;

  const handleExportAll = () => {
    setExporting(true);
    try { exportXLSX(filtered); } finally { setTimeout(()=>setExporting(false),800); }
  };

  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:11, color:C.textMuted, letterSpacing:1.5, textTransform:"uppercase", marginBottom:4 }}>Painel MDM</div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
          <h1 style={{ margin:0, fontSize:24, fontWeight:700, color:C.text }}>{title}</h1>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={handleExportAll} disabled={exporting}
              style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:6, color:exporting?C.yellow:C.textSub, padding:"8px 14px", cursor:"pointer", display:"flex", alignItems:"center", gap:6, fontSize:12, fontFamily:"'IBM Plex Sans',sans-serif", transition:"all .2s" }}>
              {exporting?<><Spinner size={12}/> Gerando...</>:<><Icon name="download" size={13} color={C.textSub}/> Converter em Planilha</>}
            </button>
            <button onClick={onRefresh} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:6, color:C.textSub, padding:"8px 14px", cursor:"pointer", display:"flex", alignItems:"center", gap:6, fontSize:12, fontFamily:"'IBM Plex Sans',sans-serif" }}>
              <Icon name="refresh" size={13} color={C.textSub}/> Atualizar
            </button>
          </div>
        </div>
      </div>

      <div style={{ display:"flex", gap:10, marginBottom:14, flexWrap:"wrap" }}>
        <div style={{ position:"relative", flex:1, minWidth:220 }}>
          <div style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}><Icon name="search" size={14} color={C.textMuted}/></div>
          <input placeholder="Buscar produto, número, solicitante..." value={search} onChange={e=>setSearch(e.target.value)} style={{...iS,paddingLeft:36}}/>
        </div>
        <select value={fSetor} onChange={e=>setFSetor(e.target.value)} style={{...iS,width:"auto",cursor:"pointer"}}>
          {setores.map(s=><option key={s}>{s}</option>)}
        </select>
      </div>

      <div style={{ display:"flex", gap:6, marginBottom:16, flexWrap:"wrap" }}>
        {statuses.map(s=>(
          <button key={s} onClick={()=>setFStatus(s)}
            style={{ background:fStatus===s?C.yellow:C.surface, border:`1px solid ${fStatus===s?C.yellow:C.border}`, color:fStatus===s?"#0C0F16":C.textSub, borderRadius:5, fontSize:11, fontWeight:fStatus===s?700:500, padding:"5px 12px", cursor:"pointer", transition:"all .15s", fontFamily:"'IBM Plex Sans',sans-serif" }}>
            {s}
          </button>
        ))}
      </div>

      <Card style={{ overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:C.surfaceMid }}>
                {["Número","Produto","Itens","Setor","Solicitante","SLA","Prioridade","Status",""].map(h=>(
                  <th key={h} style={{ padding:"11px 14px", textAlign:"left", fontSize:10, color:C.textMuted, letterSpacing:1, textTransform:"uppercase", fontWeight:700, whiteSpace:"nowrap", borderBottom:`1px solid ${C.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading?(
                <tr><td colSpan={9} style={{ padding:48, textAlign:"center" }}><div style={{ display:"flex", justifyContent:"center" }}><Spinner/></div></td></tr>
              ):filtered.length===0?(
                <tr><td colSpan={9}><Empty msg="Nenhuma solicitação encontrada."/></td></tr>
              ):filtered.map((s:any)=>{
                const h=calcSLA(s.created_at);
                return (
                  <tr key={s.id} style={{ borderTop:`1px solid ${C.border}`, cursor:"pointer", transition:"background .12s" }}
                    onMouseEnter={e=>e.currentTarget.style.background=C.surfaceMid}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                    onClick={()=>{
                      if(s.responsavel && s.responsavel!==role && role==="mdm" && !userName?.includes(s.responsavel.split(" ")[0].toLowerCase())) {
                        alert(`🔒 Solicitação em análise por: ${s.responsavel}\nApenas o responsável ou DEV pode acessar.`);
                        return;
                      }
                      setSel(s);
                    }}>
                    <td style={{ padding:"12px 14px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                        {s.urgente&&<span style={{ width:7, height:7, borderRadius:"50%", background:C.red, display:"inline-block", flexShrink:0 }}/>}
                        <span style={{ fontFamily:"monospace", fontSize:11, color:C.yellow }}>{s.numero}</span>
                      </div>
                    </td>
                    <td style={{ padding:"12px 14px", maxWidth:200 }}><span style={{ fontSize:13, color:C.text, fontWeight:500, display:"block", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.descricao}</span></td>
                    <td style={{ padding:"12px 14px" }}><span style={{ fontSize:12, color:s.total_itens>1?C.purple:C.textMuted, fontWeight:s.total_itens>1?700:400 }}>{s.total_itens||1}</span></td>
                    <td style={{ padding:"12px 14px" }}><span style={{ fontSize:12, color:C.textSub }}>{s.setor||"—"}</span></td>
                    <td style={{ padding:"12px 14px" }}><span style={{ fontSize:12, color:C.textSub }}>{s.solicitante||"—"}</span></td>
                    <td style={{ padding:"12px 14px" }}><SLABar horas={h}/></td>
                    <td style={{ padding:"12px 14px" }}><PrioTag label={s.prioridade||"Normal"}/></td>
                    <td style={{ padding:"12px 14px" }}><StatusTag status={s.status}/></td>
                    <td style={{ padding:"12px 14px" }}><button style={{ background:"none", border:`1px solid ${C.border}`, color:C.textSub, borderRadius:5, padding:"4px 10px", cursor:"pointer", fontSize:11, fontFamily:"'IBM Plex Sans',sans-serif", transition:"all .15s" }} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.yellow;e.currentTarget.style.color=C.yellow;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textSub;}}>Abrir</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ padding:"10px 14px", borderTop:`1px solid ${C.border}`, fontSize:11, color:C.textMuted }}>{filtered.length} solicitação(ões)</div>
      </Card>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// RELATÓRIOS
// ══════════════════════════════════════════════════════════════════
function Relatorios({ sols, loading }: any) {
  const byStatus = Object.entries(STATUS_CFG).map(([s,cfg])=>({ s, v:sols.filter((x:any)=>x.status===s).length, c:cfg.c })).filter(x=>x.v>0).sort((a,b)=>b.v-a.v);
  const bySetor = Array.from(new Set(sols.map((x:any)=>x.setor).filter(Boolean))).map((n:any)=>({ n, v:sols.filter((x:any)=>x.setor===n).length })).sort((a:any,b:any)=>b.v-a.v).slice(0,8) as any[];
  const maxS = bySetor[0]?.v||1;
  const total=sols.length, aprov=sols.filter((s:any)=>s.status==="Aprovado").length, reprov=sols.filter((s:any)=>s.status==="Reprovado").length;
  const taxaAprov=total?Math.round((aprov/total)*100):0, taxaReprov=total?Math.round((reprov/total)*100):0;
  const integrados=sols.filter((s:any)=>s.status==="Integrado no Protheus").length;
  const criticos=sols.filter((s:any)=>calcSLA(s.created_at)>=22).length;
  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:11, color:C.textMuted, letterSpacing:1.5, textTransform:"uppercase", marginBottom:4 }}>Análise Operacional</div>
        <h1 style={{ margin:0, fontSize:24, fontWeight:700, color:C.text }}>Relatórios e Indicadores</h1>
      </div>
      {loading?<div style={{ display:"flex", justifyContent:"center", padding:80 }}><Spinner/></div>:
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16 }}>
          <Card style={{ padding:"22px" }}>
            <div style={{ fontSize:11, color:C.textMuted, letterSpacing:1, textTransform:"uppercase", marginBottom:18 }}>Por Status</div>
            {byStatus.length===0?<Empty msg="Sem dados."/>:byStatus.map(({s,v,c})=>(
              <div key={s} style={{ marginBottom:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ fontSize:11, color:C.textSub }}>{s}</span>
                  <span style={{ fontSize:12, fontWeight:700, color:c, fontFamily:"monospace" }}>{v}</span>
                </div>
                <div style={{ height:3, background:C.border, borderRadius:2 }}><div style={{ height:"100%", width:`${(v/(total||1))*100}%`, background:c, borderRadius:2, transition:"width .5s" }}/></div>
              </div>
            ))}
          </Card>
          <Card style={{ padding:"22px" }}>
            <div style={{ fontSize:11, color:C.textMuted, letterSpacing:1, textTransform:"uppercase", marginBottom:18 }}>KPIs</div>
            {[
              {label:"Total de solicitações", value:total,           sub:"Histórico geral",     color:C.text},
              {label:"Taxa de aprovação",      value:`${taxaAprov}%`,sub:`${aprov} aprovadas`,  color:taxaAprov>=80?C.green:C.orange},
              {label:"Taxa de rejeição",       value:`${taxaReprov}%`,sub:`${reprov} reprovadas`,color:taxaReprov<=15?C.green:C.red},
              {label:"Integrados Protheus",    value:integrados,     sub:"Concluídos",           color:C.purple},
              {label:"SLA Crítico (≥22h)",     value:criticos,       sub:"Requerem atenção",    color:criticos>0?C.red:C.green},
            ].map(({label,value,sub,color})=>(
              <div key={label} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"9px 0", borderBottom:`1px solid ${C.border}` }}>
                <div><div style={{ fontSize:12, color:C.textSub }}>{label}</div><div style={{ fontSize:10, color:C.textMuted, marginTop:2 }}>{sub}</div></div>
                <div style={{ fontSize:20, fontWeight:700, color, fontFamily:"monospace" }}>{value}</div>
              </div>
            ))}
          </Card>
          <Card style={{ padding:"22px" }}>
            <div style={{ fontSize:11, color:C.textMuted, letterSpacing:1, textTransform:"uppercase", marginBottom:18 }}>Por Setor</div>
            {bySetor.length===0?<Empty msg="Sem dados."/>:bySetor.map(({n,v}:any,i:number)=>(
              <div key={n} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                <div style={{ width:20, height:20, borderRadius:4, background:C.yellowDim, border:`1px solid ${C.yellowBorder}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:C.yellow, fontWeight:700, flexShrink:0 }}>{i+1}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, color:C.text, marginBottom:4 }}>{n}</div>
                  <div style={{ height:3, background:C.border, borderRadius:2 }}><div style={{ height:"100%", width:`${(v/maxS)*100}%`, background:C.yellow+"70", borderRadius:2 }}/></div>
                </div>
                <span style={{ fontSize:12, color:C.textMuted, fontFamily:"monospace" }}>{v}</span>
              </div>
            ))}
          </Card>
        </div>
      }
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// PAINEL DESENVOLVEDOR
// ══════════════════════════════════════════════════════════════════
function DevPanel({ sols, loading, onRefresh }: any) {
  const [sel, setSel] = useState<any>(null);
  const [confirm, setConfirm] = useState<string|null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = sols.filter((s:any)=>
    s.descricao?.toLowerCase().includes(search.toLowerCase())||
    s.numero?.includes(search)||s.solicitante?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      await deleteSolicitacao(id);
      setConfirm(null);
      onRefresh();
    } catch(e:any) { alert("Erro ao excluir: "+e.message); }
    setDeleting(false);
  };

  if (sel) return <Detalhe sol={sel} onBack={()=>{setSel(null);onRefresh();}} onUpdate={onRefresh} role="dev"/>;

  return (
    <div>
      {confirm && <ConfirmModal msg="Esta ação é permanente e não pode ser desfeita. Deseja realmente excluir esta solicitação?" onConfirm={()=>handleDelete(confirm)} onCancel={()=>setConfirm(null)}/>}

      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:11, color:C.purple, letterSpacing:1.5, textTransform:"uppercase", marginBottom:4, fontWeight:700 }}>⚙ Acesso Desenvolvedor</div>
        <h1 style={{ margin:0, fontSize:24, fontWeight:700, color:C.text }}>Painel Administrativo</h1>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
        {[
          {label:"Total",       v:sols.length,                                                               c:C.text},
          {label:"Aprovados",   v:sols.filter((s:any)=>s.status==="Aprovado").length,                        c:C.green},
          {label:"Pendentes",   v:sols.filter((s:any)=>["Enviado","Em análise MDM"].includes(s.status)).length,c:C.yellow},
          {label:"SLA Crítico", v:sols.filter((s:any)=>calcSLA(s.created_at)>=22).length,                   c:C.red},
        ].map(k=>(
          <div key={k.label} style={{ background:C.surface, border:`1px solid ${C.border}`, borderLeft:`3px solid ${k.c}`, borderRadius:10, padding:"14px 16px", boxShadow:"0 2px 8px rgba(0,0,0,.2)" }}>
            <div style={{ fontSize:10, color:C.textMuted, textTransform:"uppercase", marginBottom:6 }}>{k.label}</div>
            <div style={{ fontSize:28, fontWeight:700, color:k.c }}>{loading?"…":k.v}</div>
          </div>
        ))}
      </div>

      <Card style={{ overflow:"hidden" }}>
        <div style={{ padding:"14px 16px", borderBottom:`1px solid ${C.border}`, display:"flex", gap:10, alignItems:"center" }}>
          <div style={{ position:"relative", flex:1 }}>
            <div style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)" }}><Icon name="search" size={14} color={C.textMuted}/></div>
            <input placeholder="Buscar..." value={search} onChange={e=>setSearch(e.target.value)} style={{...iS,paddingLeft:36}}/>
          </div>
          <button onClick={()=>exportXLSX(filtered)} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:6, color:C.textSub, fontSize:12, padding:"8px 14px", cursor:"pointer", display:"flex", alignItems:"center", gap:6, fontFamily:"'IBM Plex Sans',sans-serif", whiteSpace:"nowrap" }}>
            <Icon name="download" size={13} color={C.textSub}/> Exportar
          </button>
          <button onClick={onRefresh} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:6, color:C.textSub, fontSize:12, padding:"8px 14px", cursor:"pointer", display:"flex", alignItems:"center", gap:6, fontFamily:"'IBM Plex Sans',sans-serif" }}>
            <Icon name="refresh" size={13} color={C.textSub}/>
          </button>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:C.surfaceMid }}>
                {["Número","Produto","Solicitante","Setor","Status","Itens","Criado em","Ações"].map(h=>(
                  <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:10, color:C.textMuted, letterSpacing:1, textTransform:"uppercase", fontWeight:700, borderBottom:`1px solid ${C.border}`, whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading?(
                <tr><td colSpan={8} style={{ padding:40, textAlign:"center" }}><div style={{ display:"flex", justifyContent:"center" }}><Spinner/></div></td></tr>
              ):filtered.map((s:any)=>(
                <tr key={s.id} style={{ borderTop:`1px solid ${C.border}`, transition:"background .12s" }}
                  onMouseEnter={e=>e.currentTarget.style.background=C.surfaceMid}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{ padding:"10px 14px" }}><span style={{ fontFamily:"monospace", fontSize:11, color:C.yellow }}>{s.numero}</span></td>
                  <td style={{ padding:"10px 14px", maxWidth:180 }}><span style={{ fontSize:12, color:C.text, display:"block", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.descricao}</span></td>
                  <td style={{ padding:"10px 14px" }}><span style={{ fontSize:12, color:C.textSub }}>{s.solicitante||"—"}</span></td>
                  <td style={{ padding:"10px 14px" }}><span style={{ fontSize:12, color:C.textSub }}>{s.setor||"—"}</span></td>
                  <td style={{ padding:"10px 14px" }}><StatusTag status={s.status}/></td>
                  <td style={{ padding:"10px 14px" }}><span style={{ fontSize:12, color:C.textSub }}>{s.total_itens||1}</span></td>
                  <td style={{ padding:"10px 14px" }}><span style={{ fontFamily:"monospace", fontSize:10, color:C.textMuted }}>{fmtDate(s.created_at)}</span></td>
                  <td style={{ padding:"10px 14px" }}>
                    <div style={{ display:"flex", gap:6 }}>
                      <button onClick={()=>setSel(s)} style={{ background:C.blueDim, border:`1px solid ${C.blue}30`, color:C.blue, borderRadius:5, padding:"4px 10px", cursor:"pointer", fontSize:11, fontFamily:"'IBM Plex Sans',sans-serif", transition:"all .15s" }}>Abrir</button>
                      <button onClick={()=>setConfirm(s.id)}
                        style={{ background:C.redDim, border:`1px solid ${C.red}30`, color:C.red, borderRadius:5, padding:"4px 10px", cursor:"pointer", fontSize:11, fontFamily:"'IBM Plex Sans',sans-serif", transition:"all .15s" }}
                        onMouseEnter={e=>{e.currentTarget.style.background=C.red;e.currentTarget.style.color="#fff";}}
                        onMouseLeave={e=>{e.currentTarget.style.background=C.redDim;e.currentTarget.style.color=C.red;}}>
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding:"10px 14px", borderTop:`1px solid ${C.border}`, fontSize:11, color:C.textMuted }}>{filtered.length} registro(s)</div>
      </Card>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// SIDEBAR COMPONENTE
// ══════════════════════════════════════════════════════════════════
function Sidebar({ view, setView, nav, role, userName, lastSync, onLogout, isConnected, extra }: any) {
  const roleColor = role==="dev"?C.purple:role==="mdm"?C.blue:C.yellow;
  const roleLabel = role==="dev"?"Desenvolvedor":role==="mdm"?"Analista MDM":"Solicitante";
  return (
    <div style={{ width:230, background:C.surface, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", flexShrink:0 }}>
      <div style={{ padding:"20px 18px", borderBottom:`1px solid ${C.border}` }}>
        <div style={{ width:160, marginBottom:10 }} dangerouslySetInnerHTML={{ __html: VMI_LOGO.replace('width="841.89px" height="595.28px"','width="160" height="57"') }}/>
        <div style={{ fontSize:10, color:C.yellow, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", marginBottom:6 }}>Portal MDM</div>
        {userName && (
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:roleColor, display:"inline-block" }}/>
            <span style={{ fontSize:10, color:roleColor, fontWeight:600 }}>{roleLabel}</span>
          </div>
        )}
        {userName && <div style={{ fontSize:10, color:C.textMuted, marginTop:2 }}>{userName}</div>}
      </div>
      <nav style={{ flex:1, padding:"10px 8px", overflowY:"auto" }}>
        {nav.map((n: any)=>(
          <button key={n.id} onClick={()=>setView(n.id)}
            style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"9px 12px", borderRadius:6, border:"none", background:view===n.id?C.yellowDim:"transparent", color:view===n.id?C.yellow:C.textSub, fontWeight:view===n.id?600:400, cursor:"pointer", textAlign:"left", transition:"all .12s", marginBottom:2, fontFamily:"'IBM Plex Sans',sans-serif", fontSize:13, borderLeft:`2px solid ${view===n.id?C.yellow:"transparent"}` }}>
            <Icon name={n.icon} size={15} color={view===n.id?C.yellow:C.textSub}/>{n.label}
          </button>
        ))}
      </nav>
      <div style={{ padding:"14px 16px", borderTop:`1px solid ${C.border}` }}>
        {isConnected!==undefined&&(
          <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:8 }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:isConnected?C.green:C.red, display:"inline-block" }}/>
            <span style={{ fontSize:11, color:isConnected?C.green:C.red }}>{isConnected?"Banco conectado":"Config. necessária"}</span>
          </div>
        )}
        {lastSync&&<div style={{ fontSize:10, color:C.textMuted, marginBottom:8 }}>Sync: {lastSync.toLocaleTimeString("pt-BR")}</div>}
        <button onClick={onLogout} style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:6, color:C.textMuted, fontSize:11, padding:"7px 12px", cursor:"pointer", width:"100%", fontFamily:"'IBM Plex Sans',sans-serif", transition:"all .15s" }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=C.red;e.currentTarget.style.color=C.red;}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textMuted;}}>
          ← Sair
        </button>
        <div style={{ fontSize:10, color:C.textMuted, marginTop:8 }}>ICARO_DEV_TEST</div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// INTERFACE SOLICITANTE
// ══════════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════════
// ALTERAÇÃO DE CADASTRO (item 14)
// ══════════════════════════════════════════════════════════════════
function AlteracaoCadastro({ onCreated, onBack }: any) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [solNumero, setSolNumero] = useState("");
  const [codProduto, setCodProduto] = useState("");
  const [solicitante, setSolicitante] = useState("");
  const [setor, setSetor] = useState("");
  const [solicitantes, setSolicitantes] = useState<string[]>(SOLICITANTES_PADRAO);
  const [showNovoSol, setShowNovoSol] = useState(false);
  // Campos opcionais de alteração
  const [descricao, setDescricao] = useState("");
  const [tipo, setTipo] = useState("");
  const [unidade, setUnidade] = useState("");
  const [grupo, setGrupo] = useState("");
  const [ncm, setNcm] = useState("");
  const [custo, setCusto] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [instrucoes, setInstrucoes] = useState("");

  useEffect(() => {
    fetchSolicitantesDB().then(data => {
      if (data?.length) setSolicitantes([...new Set([...SOLICITANTES_PADRAO, ...data.map((d:any)=>d.nome)])]);
    }).catch(()=>{});
  }, []);

  const algumCampoPreenchido = descricao||tipo||unidade||grupo||ncm||custo||instrucoes;

  const validate = () => {
    if (!codProduto.trim()) return "Código do produto é obrigatório.";
    if (!solicitante) return "Selecione o solicitante.";
    if (!algumCampoPreenchido) return "Preencha pelo menos um campo além do código.";
    return "";
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    if (!isConfigured()) { setError("Erro de configuração."); return; }
    setSaving(true); setError("");
    try {
      const numero = `ALT-${Math.floor(1000+Math.random()*8999)}`;
      const payload = {
        numero, status:"Enviado",
        solicitante, setor,
        descricao: `[ALTERAÇÃO] ${codProduto}${descricao?" → "+descricao:""}`,
        tipo: tipo||null, unidade: unidade||null,
        grupo: grupo||null, ncm: ncm||null,
        custo: custo?parseFloat(custo.replace(/\./g,"").replace(",",".")):null,
        observacoes: `COD_PRODUTO: ${codProduto}
${instrucoes||""}
${observacoes||""}`.trim(),
        prioridade:"Normal", urgente:false, total_itens:1,
        tipo_solicitacao:"alteracao" as any,
      };
      const [created] = await insertSolicitacao(payload);
      await insertHistorico({ solicitacao_id:created.id, acao:"Alteração solicitada", usuario:solicitante, observacao:`Produto: ${codProduto}` });
      setSolNumero(numero); setSubmitted(true); onCreated();
    } catch(e:any) { setError("Erro: "+e.message); }
    setSaving(false);
  };

  if (submitted) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"60vh", gap:20 }}>
      <div style={{ width:72, height:72, borderRadius:"50%", background:C.greenDim, border:`2px solid ${C.green}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <Icon name="check" size={32} color={C.green}/>
      </div>
      <h2 style={{ margin:0, color:C.text, fontWeight:700 }}>Alteração Enviada!</h2>
      <div style={{ fontFamily:"monospace", color:C.yellow, fontSize:18, background:C.yellowDim, padding:"10px 24px", borderRadius:6, border:`1px solid ${C.yellowBorder}` }}>{solNumero}</div>
      <p style={{ color:C.textSub, textAlign:"center", maxWidth:380, lineHeight:1.6 }}>A equipe MDM analisará a solicitação de alteração.</p>
      <div style={{ display:"flex", gap:12 }}>
        <button onClick={()=>{setSubmitted(false);setCodProduto("");setDescricao("");setTipo("");setUnidade("");setGrupo("");setNcm("");setCusto("");setObservacoes("");setInstrucoes("");}}
          style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:6, color:C.textSub, fontWeight:600, fontSize:13, padding:"11px 22px", cursor:"pointer", fontFamily:"'IBM Plex Sans',sans-serif" }}>
          Nova Alteração
        </button>
        <button onClick={onBack} style={{ background:C.yellow, border:"none", borderRadius:6, color:"#0C0F16", fontWeight:700, fontSize:13, padding:"11px 22px", cursor:"pointer", fontFamily:"'IBM Plex Sans',sans-serif" }}>
          Início
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth:760, margin:"0 auto", fontFamily:"'IBM Plex Sans',sans-serif" }}>
      {showNovoSol && <NovoSolicitanteModal onSave={(nome:string)=>{ setSolicitantes(s=>[...s,nome]); setSolicitante(nome); setShowNovoSol(false); }} onCancel={()=>setShowNovoSol(false)}/>}
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:11, color:C.orange, letterSpacing:1.5, textTransform:"uppercase", marginBottom:4, fontWeight:700 }}>Solicitação de Alteração</div>
        <h1 style={{ margin:0, fontSize:24, fontWeight:700, color:C.text }}>Alterar Cadastro</h1>
        <p style={{ color:C.textMuted, fontSize:13, marginTop:6 }}>Informe o código do produto e os campos que deseja alterar. Apenas o código é obrigatório.</p>
      </div>

      <Card style={{ padding:"22px 26px", marginBottom:16 }}>
        <SecHead icon="tag" title="Identificação"/>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          <div style={{ gridColumn:"1/-1" }}>
            <Field label="Código do Produto (obrigatório)" placeholder="Ex: 00105 ou código Protheus do produto" value={codProduto} onChange={(e:any)=>setCodProduto(e.target.value)} required/>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <label style={{ fontSize:11, fontWeight:600, color:C.textSub, letterSpacing:0.5, textTransform:"uppercase" }}>Solicitante<span style={{ color:C.yellow, marginLeft:3 }}>*</span></label>
              <button onClick={()=>setShowNovoSol(true)} style={{ background:C.yellowDim, border:`1px solid ${C.yellowBorder}`, borderRadius:4, color:C.yellow, fontSize:11, cursor:"pointer", display:"flex", alignItems:"center", gap:4, padding:"3px 8px", fontFamily:"'IBM Plex Sans',sans-serif" }}>
                <Icon name="plus" size={11} color={C.yellow}/> Novo
              </button>
            </div>
            <SearchSelect value={solicitante} onChange={setSolicitante} options={solicitantes} placeholder="Buscar solicitante..." required/>
          </div>
          <SearchSelect label="Setor" value={setor} onChange={setSetor} options={SETORES_EMPRESA} placeholder="Buscar setor..."/>
        </div>
      </Card>

      <Card style={{ padding:"22px 26px", marginBottom:16 }}>
        <SecHead icon="edit" title="Campos a Alterar (preencha apenas o que muda)"/>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          <div style={{ gridColumn:"1/-1" }}>
            <Field label="Nova Descrição" placeholder="Deixe em branco se não alterar" value={descricao} onChange={(e:any)=>setDescricao(e.target.value)} maxLen={90}/>
          </div>
          <Field label="Novo Tipo" type="select" placeholder="Deixe em branco se não alterar" value={tipo} onChange={(e:any)=>setTipo(e.target.value)} options={SIGLAS.map(s=>({value:s.value,label:s.label}))}/>
          <SearchSelect label="Nova Unidade" value={unidade} onChange={setUnidade} options={UNIDADES} placeholder="Deixe em branco se não alterar"/>
          <SearchSelect label="Novo Grupo Protheus" value={grupo} onChange={setGrupo} options={GRUPOS_PROTHEUS_ITENS} placeholder="Deixe em branco se não alterar"/>
          <Field label="Novo NCM" placeholder="Deixe em branco se não alterar" value={ncm} onChange={(e:any)=>setNcm(e.target.value)}/>
          <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
            <label style={{ fontSize:11, fontWeight:600, color:C.textSub, letterSpacing:0.5, textTransform:"uppercase" }}>Novo Custo Estimado (R$)</label>
            <input placeholder="Deixe em branco se não alterar" value={custo}
              inputMode="numeric"
              onChange={e=>{
                let raw=e.target.value.replace(/[^0-9]/g,"");
                if(!raw){setCusto("");return;}
                setCusto((parseInt(raw,10)/100).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2}));
              }} style={iS}/>
          </div>
          <div style={{ gridColumn:"1/-1" }}>
            <Field label="Instruções Específicas de Alteração" type="textarea" placeholder="Descreva detalhadamente o que deve ser alterado e o motivo..." value={instrucoes} onChange={(e:any)=>setInstrucoes(e.target.value)}/>
          </div>
          <div style={{ gridColumn:"1/-1" }}>
            <Field label="Observações Adicionais" type="textarea" placeholder="Qualquer informação complementar..." value={observacoes} onChange={(e:any)=>setObservacoes(e.target.value)}/>
          </div>
        </div>
      </Card>

      {error && <div style={{ padding:"12px 16px", background:C.redDim, border:`1px solid ${C.red}40`, borderRadius:8, color:C.red, fontSize:13, marginBottom:16, display:"flex", alignItems:"center", gap:8 }}><Icon name="alert" size={14} color={C.red}/>{error}</div>}

      <div style={{ display:"flex", justifyContent:"space-between" }}>
        <button onClick={onBack} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:6, color:C.textSub, fontWeight:600, fontSize:13, padding:"11px 22px", cursor:"pointer", fontFamily:"'IBM Plex Sans',sans-serif" }}>Cancelar</button>
        <button onClick={handleSubmit} disabled={saving}
          style={{ background:saving?C.border:C.orange, border:"none", borderRadius:6, color:"#fff", fontWeight:700, fontSize:13, padding:"11px 22px", cursor:saving?"wait":"pointer", fontFamily:"'IBM Plex Sans',sans-serif", display:"flex", alignItems:"center", gap:8 }}>
          {saving?<><Spinner size={14}/> Salvando...</>:<><Icon name="send" size={13} color="#fff"/> Enviar Alteração</>}
        </button>
      </div>
    </div>
  );
}

function SolicitanteApp({ onLogout }: any) {
  const [view, setView] = useState<"home"|"nova">("home");
  const [sols, setSols] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const loadData = useCallback(async () => {
    if (!isConfigured()) return;
    setLoading(true);
    try { setSols(await fetchSolicitacoes()); } catch {}
    setLoading(false);
  }, []);
  useEffect(()=>{ loadData(); },[loadData]);
  const NAV = [{ id:"home", icon:"dashboard", label:"Início" }, { id:"nova", icon:"plus", label:"Nova Solicitação" }, { id:"alterar", icon:"edit", label:"Alterar Cadastro" }, { id:"finalizados", icon:"check", label:"Finalizados" }];
  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;700&display=swap');@keyframes spin{to{transform:rotate(360deg)}}@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#252D3E;border-radius:3px}input,select,textarea{color-scheme:dark}input:focus,select:focus,textarea:focus{border-color:#F4B61A!important;outline:none;box-shadow:0 0 0 3px #F4B61A10}button:active{opacity:.85}option{background:#131825}`}</style>
      <div style={{ display:"flex", height:"100vh", background:C.bg, fontFamily:"'IBM Plex Sans',sans-serif", color:C.text, overflow:"hidden" }}>
        <Sidebar view={view} setView={setView} nav={NAV} role="solicitante" onLogout={onLogout}/>
        <main style={{ flex:1, overflowY:"auto", padding:"28px 32px" }}>
          {view==="home"&&(
            <div style={{ animation:"fadeIn .25s ease" }}>
              <div style={{ marginBottom:28 }}>
                <div style={{ fontSize:11, color:C.textMuted, letterSpacing:1.5, textTransform:"uppercase", marginBottom:4 }}>Bem-vindo</div>
                <h1 style={{ margin:0, fontSize:26, fontWeight:700, color:C.text }}>Portal de <span style={{color:C.yellow}}>Solicitações</span></h1>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:24 }}>
                <button onClick={()=>setView("nova")} style={{ background:C.yellowDim, border:`1px solid ${C.yellowBorder}`, borderRadius:12, padding:"30px 24px", cursor:"pointer", textAlign:"left", fontFamily:"'IBM Plex Sans',sans-serif", transition:"all .2s" }}
                  onMouseEnter={e=>{e.currentTarget.style.background=C.yellow+"25";e.currentTarget.style.transform="translateY(-3px)";}}
                  onMouseLeave={e=>{e.currentTarget.style.background=C.yellowDim;e.currentTarget.style.transform="translateY(0)";}}>
                  <Icon name="plus" size={30} color={C.yellow}/>
                  <div style={{ fontSize:16, fontWeight:700, color:C.yellow, marginTop:14 }}>Nova Solicitação</div>
                  <div style={{ fontSize:12, color:C.textMuted, marginTop:4 }}>Solicitar cadastro de produto(s)</div>
                </button>
                <Card style={{ padding:"30px 24px" }}>
                  <Icon name="clock" size={30} color={C.blue}/>
                  <div style={{ fontSize:16, fontWeight:700, color:C.text, marginTop:14 }}>Solicitações em Andamento</div>
                  <div style={{ fontSize:28, fontWeight:700, color:C.blue, marginTop:6 }}>{loading?"…":sols.length} total</div>
                </Card>
              </div>
              <Card style={{ padding:0, overflow:"hidden" }}>
                <div style={{ padding:"14px 20px", borderBottom:`1px solid ${C.border}` }}>
                  <span style={{ fontWeight:700, fontSize:14, color:C.text }}>Solicitações Recentes</span>
                </div>
                {loading?<div style={{ padding:40, display:"flex", justifyContent:"center" }}><Spinner/></div>
                  :sols.length===0?<Empty msg="Nenhuma solicitação ainda."/>
                  :sols.slice(0,5).map((s:any,i:number)=>(
                    <div key={s.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 20px", borderBottom:i<4?`1px solid ${C.border}`:"none" }}>
                      {s.urgente&&<span style={{ width:6, height:6, borderRadius:"50%", background:C.red, display:"inline-block", flexShrink:0 }}/>}
                      <span style={{ fontFamily:"monospace", fontSize:11, color:C.yellow, minWidth:90 }}>{s.numero}</span>
                      <span style={{ flex:1, fontSize:13, color:C.text, fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.descricao}</span>
                      <span style={{ fontSize:10, color:C.textMuted }}>{fmtDate(s.created_at)}</span>
                      {s.responsavel&&<span style={{ fontSize:10, color:C.blue, background:C.blueDim, border:`1px solid ${C.blue}30`, borderRadius:4, padding:"1px 7px" }}>👤 {s.responsavel}</span>}
                      <StatusTag status={s.status}/>
                    </div>
                  ))
                }
              </Card>
            </div>
          )}
          {view==="nova"&&<NovaSolicitacao onCreated={loadData} onBack={()=>setView("home")}/>}
          {view==="finalizados"&&(
            <div style={{ animation:"fadeIn .25s ease" }}>
              <div style={{ marginBottom:24 }}>
                <div style={{ fontSize:11, color:C.green, letterSpacing:1.5, textTransform:"uppercase", marginBottom:4, fontWeight:700 }}>Histórico</div>
                <h1 style={{ margin:0, fontSize:24, fontWeight:700, color:C.text }}>Cadastros <span style={{color:C.green}}>Finalizados</span></h1>
              </div>
              {sols.filter((s:any)=>s.status==="Finalizado").length===0
                ? <Empty msg="Nenhum cadastro finalizado ainda."/>
                : <Card style={{ padding:0, overflow:"hidden" }}>
                    {sols.filter((s:any)=>s.status==="Finalizado").map((s:any,i:number,arr:any[])=>(
                      <div key={s.id} style={{ padding:"14px 20px", borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
                          <span style={{ fontFamily:"monospace", fontSize:11, color:C.green, minWidth:90 }}>{s.numero}</span>
                          <span style={{ flex:1, fontSize:13, color:C.text, fontWeight:500 }}>{s.descricao}</span>
                          <StatusTag status={s.status}/>
                        </div>
                        <div style={{ display:"flex", gap:16, marginTop:6, fontSize:11, color:C.textMuted, flexWrap:"wrap" }}>
                          {s.responsavel&&<span>👤 {s.responsavel}</span>}
                          <span>📅 {fmtDate(s.created_at)}</span>
                          {s.setor&&<span>🏢 {s.setor}</span>}
                          {s.observacoes&&<span>💬 {s.observacoes.slice(0,60)}{s.observacoes.length>60?"...":""}</span>}
                        </div>
                      </div>
                    ))}
                  </Card>
              }
            </div>
          )}
          {view==="alterar"&&<AlteracaoCadastro onCreated={loadData} onBack={()=>setView("home")}/>}
        </main>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════
// INTERFACE MDM / DEV
// ══════════════════════════════════════════════════════════════════
function MDMApp({ role, userName, onLogout }: any) {
  const [view, setView] = useState("dashboard");
  const [sols, setSols] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastSync, setLastSync] = useState<Date|null>(null);
  const loadData = useCallback(async () => {
    if (!isConfigured()) return;
    setLoading(true);
    try { setSols(await fetchSolicitacoes()); setLastSync(new Date()); } catch {}
    setLoading(false);
  }, []);
  useEffect(()=>{ loadData(); },[loadData]);
  useEffect(()=>{ const id=setInterval(loadData,30000); return ()=>clearInterval(id); },[loadData]);

  const NAV = [
    { id:"dashboard",   icon:"dashboard", label:"Dashboard"          },
    { id:"fila",        icon:"list",      label:"Solicitações"        },
    { id:"alteracoes",  icon:"edit",      label:"Alterações"         },
    { id:"finalizados", icon:"check",     label:"Finalizados"        },
    { id:"relatorios",  icon:"chart",     label:"Relatórios"         },
    ...(role==="dev"?[{ id:"dev", icon:"wrench", label:"Painel Dev" }]:[]),
  ];

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;700&display=swap');@keyframes spin{to{transform:rotate(360deg)}}@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#252D3E;border-radius:3px}input,select,textarea{color-scheme:dark}input:focus,select:focus,textarea:focus{border-color:#F4B61A!important;outline:none;box-shadow:0 0 0 3px #F4B61A10}button:active{opacity:.85}option{background:#131825}`}</style>
      <div style={{ display:"flex", height:"100vh", background:C.bg, fontFamily:"'IBM Plex Sans',sans-serif", color:C.text, overflow:"hidden" }}>
        <Sidebar view={view} setView={setView} nav={NAV} role={role} userName={userName} lastSync={lastSync} onLogout={onLogout} isConnected={isConfigured()}/>
        <main style={{ flex:1, overflowY:"auto", padding:"28px 32px" }}>
          <div style={{ animation:"fadeIn .2s ease" }}>
            {view==="dashboard"   &&<Dashboard sols={sols} loading={loading} setView={setView}/>}
            {view==="fila"        &&<FilaMDM sols={sols.filter((s:any)=>s.tipo_solicitacao!=="alteracao"&&s.status!=="Finalizado")} loading={loading} onRefresh={loadData} role={role} title="Solicitações de Cadastro"/>}
            {view==="alteracoes"  &&<FilaMDM sols={sols.filter((s:any)=>s.tipo_solicitacao==="alteracao"&&s.status!=="Finalizado")} loading={loading} onRefresh={loadData} role={role} title="Alterações de Cadastro"/>}
            {view==="finalizados" &&<FilaMDM sols={sols.filter((s:any)=>s.status==="Finalizado")} loading={loading} onRefresh={loadData} role={role} title="Cadastros Finalizados"/>}
            {view==="relatorios"  &&<Relatorios sols={sols} loading={loading}/>}
            {view==="dev"&&role==="dev"&&<DevPanel sols={sols} loading={loading} onRefresh={loadData}/>}
          </div>
        </main>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════
// APP ROOT
// ══════════════════════════════════════════════════════════════════
export default function App() {
  const [auth, setAuth] = useState<{role:string,userName?:string}|null>(null);
  if (!auth) return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;700&display=swap');@keyframes spin{to{transform:rotate(360deg)}}@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}*{box-sizing:border-box;margin:0;padding:0}input,select,textarea{color-scheme:dark}input:focus,select:focus,textarea:focus{border-color:#F4B61A!important;outline:none}button:active{opacity:.85}option{background:#131825}`}</style>
      <LoginScreen onLogin={(role:string,userName?:string)=>setAuth({role,userName})}/>
    </>
  );
  if (auth.role==="solicitante") return <SolicitanteApp onLogout={()=>setAuth(null)}/>;
  return <MDMApp role={auth.role} userName={auth.userName} onLogout={()=>setAuth(null)}/>;
}
