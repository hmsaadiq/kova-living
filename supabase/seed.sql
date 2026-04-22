-- Seed products — run after schema.sql
truncate products;

insert into products (slug, name, category, base_price, description, featured, options) values

('kova-modular-sofa', 'Kova Modular Sofa', 'living-room', 1890.00,
 'A fully modular sofa system built for how you actually live. Configure from two to five sections, choose your fabric, and select a leg finish that ties the room together. Each piece ships flat and assembles in under an hour.',
 true,
 '[
   {"name":"Fabric","key":"fabric","type":"swatch","choices":[
     {"label":"Natural Linen","value":"linen","priceModifier":0},
     {"label":"Velvet","value":"velvet","priceModifier":280},
     {"label":"Boucle","value":"boucle","priceModifier":420},
     {"label":"Performance Weave","value":"performance","priceModifier":160}
   ]},
   {"name":"Sections","key":"sections","type":"toggle","choices":[
     {"label":"2-seat","value":"2seat","priceModifier":0},
     {"label":"3-seat","value":"3seat","priceModifier":380},
     {"label":"4-seat + chaise","value":"4seat-chaise","priceModifier":780}
   ]},
   {"name":"Legs","key":"legs","type":"swatch","choices":[
     {"label":"Oak","value":"oak","priceModifier":0},
     {"label":"Walnut","value":"walnut","priceModifier":120},
     {"label":"Black Metal","value":"black-metal","priceModifier":80}
   ]}
 ]'::jsonb),

('kova-lounge-chair', 'Kova Lounge Chair', 'living-room', 890.00,
 'A deep-seated lounge chair designed for long evenings. The low profile and wide seat accommodate any sitting position without sacrificing structure. Pairs naturally with the Kova Modular Sofa when matching fabric and leg options are selected.',
 true,
 '[
   {"name":"Fabric","key":"fabric","type":"swatch","choices":[
     {"label":"Natural Linen","value":"linen","priceModifier":0},
     {"label":"Velvet","value":"velvet","priceModifier":180},
     {"label":"Boucle","value":"boucle","priceModifier":260},
     {"label":"Performance Weave","value":"performance","priceModifier":100}
   ]},
   {"name":"Legs","key":"legs","type":"swatch","choices":[
     {"label":"Oak","value":"oak","priceModifier":0},
     {"label":"Walnut","value":"walnut","priceModifier":80},
     {"label":"Black Metal","value":"black-metal","priceModifier":60}
   ]}
 ]'::jsonb),

('aldren-coffee-table', 'Aldren Coffee Table', 'living-room', 620.00,
 'Solid wood construction with clean lines and a lower shelf for storage. Available in two sizes to suit smaller apartments or larger living spaces. The Aldren series pairs with the Aldren Nightstand for a cohesive aesthetic.',
 false,
 '[
   {"name":"Wood finish","key":"finish","type":"swatch","choices":[
     {"label":"Natural Oak","value":"oak","priceModifier":0},
     {"label":"Smoked Walnut","value":"walnut","priceModifier":140},
     {"label":"Ebonized Ash","value":"ebony","priceModifier":200}
   ]},
   {"name":"Size","key":"size","type":"toggle","choices":[
     {"label":"Small (90×50cm)","value":"small","priceModifier":0},
     {"label":"Large (120×65cm)","value":"large","priceModifier":160}
   ]}
 ]'::jsonb),

('lune-bed-frame', 'Lune Bed Frame', 'bedroom', 1240.00,
 'A platform bed frame with a low-profile headboard and solid wood slat base — no box spring required. The Lune is designed to be the anchor of the room: understated, structural, and built to outlast trends.',
 true,
 '[
   {"name":"Wood finish","key":"finish","type":"swatch","choices":[
     {"label":"Natural Oak","value":"oak","priceModifier":0},
     {"label":"Smoked Walnut","value":"walnut","priceModifier":180},
     {"label":"Ebonized Ash","value":"ebony","priceModifier":240}
   ]},
   {"name":"Size","key":"size","type":"toggle","choices":[
     {"label":"Queen (160×200cm)","value":"queen","priceModifier":0},
     {"label":"King (180×200cm)","value":"king","priceModifier":220}
   ]}
 ]'::jsonb),

('aldren-nightstand', 'Aldren Nightstand', 'bedroom', 380.00,
 'A compact nightstand with a single drawer and open lower shelf. Solid wood throughout — no veneers. Matches the Aldren Coffee Table and ships fully assembled.',
 false,
 '[
   {"name":"Wood finish","key":"finish","type":"swatch","choices":[
     {"label":"Natural Oak","value":"oak","priceModifier":0},
     {"label":"Smoked Walnut","value":"walnut","priceModifier":80},
     {"label":"Ebonized Ash","value":"ebony","priceModifier":110}
   ]}
 ]'::jsonb),

('sable-dresser', 'Sable Dresser', 'bedroom', 950.00,
 'Six-drawer dresser in ebonized ash with brushed brass pulls. A statement piece that earns its place in any bedroom without demanding attention. Solid wood frame, dovetail-jointed drawers, soft-close mechanism.',
 false,
 '[]'::jsonb),

('kova-dining-table', 'Kova Dining Table', 'dining', 1450.00,
 'A dining table built for real meals and long conversations. Solid wood top with a mortise-and-tenon base — no wobble, no flex. Seats four to eight depending on size, and the oval option eliminates the awkward corner seat.',
 false,
 '[
   {"name":"Wood finish","key":"finish","type":"swatch","choices":[
     {"label":"Natural Oak","value":"oak","priceModifier":0},
     {"label":"Smoked Walnut","value":"walnut","priceModifier":220},
     {"label":"Ebonized Ash","value":"ebony","priceModifier":300}
   ]},
   {"name":"Size","key":"size","type":"toggle","choices":[
     {"label":"4-seater (160×85cm)","value":"4seat","priceModifier":0},
     {"label":"6-seater (200×90cm)","value":"6seat","priceModifier":280},
     {"label":"8-seater (240×95cm)","value":"8seat","priceModifier":520}
   ]},
   {"name":"Shape","key":"shape","type":"toggle","choices":[
     {"label":"Rectangular","value":"rect","priceModifier":0},
     {"label":"Oval","value":"oval","priceModifier":180}
   ]}
 ]'::jsonb),

('sato-dining-chair', 'Sato Dining Chair', 'dining', 420.00,
 'A dining chair that works with any table and commits to none. The Sato has a slightly angled back for comfort, an upholstered seat, and a wood frame available in three finishes. Sold individually — mix finishes intentionally.',
 false,
 '[
   {"name":"Seat material","key":"seat","type":"swatch","choices":[
     {"label":"Natural Linen","value":"linen","priceModifier":0},
     {"label":"Velvet","value":"velvet","priceModifier":90},
     {"label":"Full leather","value":"leather","priceModifier":240}
   ]},
   {"name":"Frame finish","key":"frame","type":"swatch","choices":[
     {"label":"Natural Oak","value":"oak","priceModifier":0},
     {"label":"Smoked Walnut","value":"walnut","priceModifier":60},
     {"label":"Black","value":"black","priceModifier":40}
   ]}
 ]'::jsonb);
