/**
 * Seed file for TGC Church CRM
 *
 * Initial data: PCA Calvary Presbytery churches (South Carolina)
 * Source: calvarypresbytery.org/churches + naparcsearch.com/pca/calvary
 * Last verified: 2026-03-04
 *
 * Calvary Presbytery covers the SC Upcountry (13 counties, ~42 churches, 10,000+ members)
 * Presbytery website: calvarypresbytery.org
 *
 * To run: npm run db:seed
 * After seeding: hit GET /api/geocode?batch=true to populate map coordinates
 *
 * Future population targets (10,000+ churches):
 *   - PCA (via presbyteryportal.pcanet.org)
 *   - SBC — conservative/Reformed wing (churches.sbc.net)
 *   - ARP (arpc.org)
 *   - Acts 29 Network (acts29.com/churches)
 *   - 9Marks affiliated (9marks.org/church-search)
 *   - Evangelical Free — Reformed (efca.org)
 *
 * Theological filter: Reformed soteriology, Biblical inerrancy,
 * culturally engaged — aligned with TGC Foundation Documents.
 */

import { PrismaClient, EngagementStatus } from "@prisma/client";
const prisma = new PrismaClient();

type ChurchSeed = {
  name: string;
  denomination?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  website?: string;
  phone?: string;
  pastorName?: string;
  pastorEmail?: string;
  associatePastorName?: string;
  notes?: string;
  status?: EngagementStatus;
};

// PCA Calvary Presbytery — South Carolina Upcountry
const calvaryPresbytery: ChurchSeed[] = [
  {
    name: "Antioch Presbyterian Church",
    denomination: "PCA",
    address: "3600 SC-417",
    city: "Woodruff",
    state: "SC",
    website: "https://www.antiochpca.com",
    phone: "(864) 595-1373",
    pastorName: "Zachary Groff",
    notes: "Calvary Presbytery",
  },
  {
    name: "Blue Ridge Presbyterian Church",
    denomination: "PCA",
    address: "2094 Highway 101 North",
    city: "Greer",
    state: "SC",
    website: "https://blueridgepres.com",
    phone: "(864) 483-2140",
    pastorName: "Thomas Griffith",
    pastorEmail: "info@blueridgepres.com",
    notes: "Calvary Presbytery",
  },
  {
    name: "Calvary Presbyterian Church",
    denomination: "PCA",
    address: "9201 Old White Horse Road",
    city: "Greenville",
    state: "SC",
    zip: "29617",
    phone: "(864) 294-0895",
    notes: "Calvary Presbytery",
  },
  {
    name: "Center Point Presbyterian Church",
    denomination: "PCA",
    address: "1119 Moore Duncan Highway",
    city: "Moore",
    state: "SC",
    phone: "(864) 576-7617",
    pastorName: "James D. Brown",
    notes: "Calvary Presbytery",
  },
  {
    name: "Christ Community Church",
    denomination: "PCA",
    address: "700 Harrison Bridge Road",
    city: "Simpsonville",
    state: "SC",
    website: "https://www.christcommunitychurchonline.org",
    phone: "(864) 967-2815",
    pastorName: "Paul Lambert Sanders",
    pastorEmail: "Paul@Christcommunitychurchonline.org",
    notes: "Calvary Presbytery",
  },
  {
    name: "Clemson Presbyterian Church",
    denomination: "PCA",
    address: "346 Old Greenville Highway",
    city: "Clemson",
    state: "SC",
    website: "https://www.clemsonpres.org",
    phone: "(864) 654-4772",
    pastorName: "Bryan Jordan Counts",
    pastorEmail: "contactus@clemsonpres.org",
    notes: "Calvary Presbytery. RUF ministry at Clemson University.",
  },
  {
    name: "Covenant Presbyterian Church",
    denomination: "PCA",
    address: "4500 Highway 86",
    city: "Easley",
    state: "SC",
    website: "https://www.mycovenantpc.com",
    phone: "(864) 859-0967",
    pastorName: "David Preston",
    pastorEmail: "info@mycovenantpc.com",
    notes: "Calvary Presbytery",
  },
  {
    name: "Crossgate Church",
    denomination: "PCA",
    address: "404 Keowee School Road",
    city: "Seneca",
    state: "SC",
    website: "https://www.crossgatepca.org",
    phone: "(864) 886-8005",
    pastorName: "David Story",
    notes: "Calvary Presbytery",
  },
  {
    name: "Downtown Presbyterian Church",
    denomination: "PCA",
    address: "435 West Washington Street",
    city: "Greenville",
    state: "SC",
    website: "https://www.downtownpres.org",
    phone: "(864) 608-5529",
    pastorName: "Brian C. Habig",
    pastorEmail: "admin@downtownpres.org",
    notes: "Calvary Presbytery",
  },
  {
    name: "Eastside Presbyterian Church",
    denomination: "PCA",
    address: "830 Garlington Road",
    city: "Greenville",
    state: "SC",
    website: "https://www.eastsidepres.com",
    phone: "(864) 678-5100",
    pastorEmail: "info@eastsidepres.com",
    notes: "Calvary Presbytery",
  },
  {
    name: "Emmanuel Upstate Presbyterian Church",
    denomination: "PCA",
    address: "1100 Piedmont Park Road",
    city: "Taylors",
    state: "SC",
    website: "https://emmanuelupstate.org",
    phone: "(864) 381-8062",
    pastorName: "William Castro",
    pastorEmail: "info@emmanuelupstate.org",
    notes: "Calvary Presbytery",
  },
  {
    name: "Fairview Presbyterian Church",
    denomination: "PCA",
    address: "126 Fairview Church Road",
    city: "Fountain Inn",
    state: "SC",
    website: "https://www.fairviewpca.com",
    phone: "(864) 862-2403",
    pastorName: "Kenny Maple",
    pastorEmail: "pastor@fairviewpca.com",
    notes: "Calvary Presbytery",
  },
  {
    name: "Fellowship Presbyterian Church",
    denomination: "PCA",
    address: "1105 Old Spartanburg Road",
    city: "Greer",
    state: "SC",
    website: "https://www.fellowshippres.org",
    phone: "(864) 877-3267",
    pastorName: "Marty Huskey Martin",
    pastorEmail: "office@fellowshippres.org",
    notes: "Calvary Presbytery",
  },
  {
    name: "Friendship Presbyterian Church",
    denomination: "PCA",
    address: "2094 Neely Ferry Road",
    city: "Laurens",
    state: "SC",
    website: "https://www.friendshippca.org",
    phone: "(864) 575-2257",
    pastorName: "Robert D. Cathcart Jr.",
    pastorEmail: "fpc@prtcnet.com",
    notes: "Calvary Presbytery. Robert Cathcart is also Recording Clerk of Calvary Presbytery.",
  },
  {
    name: "Fulton Presbyterian Church",
    denomination: "PCA",
    address: "821 Abner Creek Road",
    city: "Greer",
    state: "SC",
    website: "https://www.fultonpca.org",
    phone: "(864) 879-3190",
    pastorName: "Grover B. Timms Jr.",
    pastorEmail: "info@fultonpca.org",
    notes: "Calvary Presbytery",
  },
  {
    name: "Good Shepherd Presbyterian Church",
    denomination: "PCA",
    address: "1702 E North Street",
    city: "Greenville",
    state: "SC",
    website: "https://www.goodshepgvl.com",
    pastorName: "Chandler Machemehl",
    notes: "Calvary Presbytery",
  },
  {
    name: "Grace and Peace Presbyterian Church",
    denomination: "PCA",
    address: "1215 Buncombe Road",
    city: "Greenville",
    state: "SC",
    website: "https://graceandpeacepres.com",
    phone: "(864) 283-6603",
    pastorName: "Timothy Joseph Udouj",
    pastorEmail: "office@graceandpeacepres.com",
    notes: "Calvary Presbytery",
  },
  {
    name: "Grace Presbyterian Church",
    denomination: "PCA",
    address: "570 Brawley Street",
    city: "Spartanburg",
    state: "SC",
    website: "https://www.gracespartanburg.com",
    phone: "(864) 381-7075",
    pastorName: "Justin Kendrick",
    pastorEmail: "gracepcaspartanburg@gmail.com",
    notes: "Calvary Presbytery. Also known as Grace Church Spartanburg.",
  },
  {
    name: "Greenwood Presbyterian Church",
    denomination: "PCA",
    address: "1414 Calhoun Road",
    city: "Greenwood",
    state: "SC",
    website: "https://greenwoodpres.com",
    phone: "(864) 942-0950",
    pastorName: "Paul Garibay Patrick",
    pastorEmail: "gwdpres@embarqmail.com",
    notes: "Calvary Presbytery",
  },
  {
    name: "Horizon Church",
    denomination: "PCA",
    address: "1017 E. Butler Road",
    city: "Greenville",
    state: "SC",
    website: "https://www.HorizonChurch.org",
    phone: "(864) 286-9911",
    pastorName: "Joseph A. Franks IV",
    pastorEmail: "office@horizonchurch.org",
    notes: "Calvary Presbytery",
  },
  {
    name: "Keowee Presbyterian Church",
    denomination: "PCA",
    city: "Central",
    state: "SC",
    website: "https://www.keoweepres.org",
    phone: "(864) 650-3362",
    pastorName: "Ron Hughes",
    pastorEmail: "keoweepresbyterian@bellsouth.net",
    notes: "Calvary Presbytery. Near Clemson/Southern Wesleyan University.",
  },
  {
    name: "Lebanon Presbyterian Church",
    denomination: "PCA",
    address: "698 Mount Carmel Road",
    city: "Abbeville",
    state: "SC",
    website: "https://lebanonpca-abbeville.com",
    phone: "(864) 446-2246",
    pastorName: "John Owen Butler",
    pastorEmail: "lebanonPresby@gmail.com",
    notes: "Calvary Presbytery",
  },
  {
    name: "Liberty Springs Presbyterian Church",
    denomination: "PCA",
    address: "200 Liberty Springs Road",
    city: "Cross Hill",
    state: "SC",
    website: "https://libertyspringschurch.com",
    pastorName: "Andrew Perrie",
    notes: "Calvary Presbytery. Mission church. Est. 1787.",
  },
  {
    name: "Living Hope Presbyterian Church",
    denomination: "PCA",
    address: "902 Glenn Street",
    city: "Anderson",
    state: "SC",
    website: "https://www.livinghopeanderson.com",
    phone: "(864) 617-9805",
    pastorName: "Jacob Webb",
    pastorEmail: "livinghopeanderson@gmail.com",
    notes: "Calvary Presbytery",
  },
  {
    name: "Mitchell Road Presbyterian Church",
    denomination: "PCA",
    address: "207 Mitchell Road",
    city: "Greenville",
    state: "SC",
    website: "https://www.mitchellroad.org",
    phone: "(864) 268-2218",
    pastorName: "Andy Lewis",
    notes: "Calvary Presbytery",
  },
  {
    name: "Mount Calvary Presbyterian Church",
    denomination: "PCA",
    address: "1399 Walnut Grove Road",
    city: "Roebuck",
    state: "SC",
    website: "https://www.mtcalvary.org",
    phone: "(864) 576-6156",
    pastorName: "Richard M. Thomas",
    pastorEmail: "media@mtcalvary.org",
    notes: "Calvary Presbytery",
  },
  {
    name: "Mountville Presbyterian Church",
    denomination: "PCA",
    city: "Mountville",
    state: "SC",
    notes: "Calvary Presbytery",
  },
  {
    name: "New Covenant Church",
    denomination: "PCA",
    address: "301 Simpson Road",
    city: "Anderson",
    state: "SC",
    website: "https://www.ncchurch.net",
    phone: "(864) 224-8724",
    pastorName: "Dr. T. David Rountree",
    pastorEmail: "office@ncchurch.net",
    notes: "Calvary Presbytery",
  },
  {
    name: "New Harmony Presbyterian Church",
    denomination: "PCA",
    city: "Fountain Inn",
    state: "SC",
    notes: "Calvary Presbytery. Est. 1844.",
  },
  {
    name: "New Hope Presbyterian Church",
    denomination: "PCA",
    address: "136 Highway 71",
    city: "Abbeville",
    state: "SC",
    website: "https://newhopeabbeville.org",
    notes: "Calvary Presbytery",
  },
  {
    name: "Norris Hill Presbyterian Church",
    denomination: "PCA",
    address: "3600 Abbeville Highway",
    city: "Anderson",
    state: "SC",
    phone: "(864) 296-2522",
    notes: "Calvary Presbytery. Est. 1968.",
  },
  {
    name: "Oconee Presbyterian Church",
    denomination: "PCA",
    address: "121 Rochester Highway",
    city: "Seneca",
    state: "SC",
    website: "https://oconeepres.org",
    phone: "(864) 882-8444",
    pastorName: "Scott Charles Cook",
    pastorEmail: "office@oconeepres.org",
    notes: "Calvary Presbytery",
  },
  {
    name: "Palmetto Hills Presbyterian Church",
    denomination: "PCA",
    address: "2147 East Georgia Road",
    city: "Simpsonville",
    state: "SC",
    website: "https://www.palmettohills.com",
    phone: "(864) 963-9600",
    pastorName: "Joshua A. Martin",
    notes: "Calvary Presbytery. Joshua Martin is also Moderator of Calvary Presbytery.",
  },
  {
    name: "Powell Presbyterian Church",
    denomination: "PCA",
    address: "119 County Road",
    city: "Spartanburg",
    state: "SC",
    website: "https://powellpresbyterianchurch.org",
    phone: "(864) 587-1486",
    pastorName: "Bruce Tjelta",
    notes: "Calvary Presbytery",
  },
  {
    name: "Providence Presbyterian Church",
    denomination: "PCA",
    address: "1665 Fernwood-Glendale Road",
    city: "Spartanburg",
    state: "SC",
    website: "https://www.providencepresbyterianchurch.com",
    phone: "(864) 579-1665",
    pastorName: "Daniel C. Coleman",
    pastorEmail: "providencespartanburg@gmail.com",
    notes: "Calvary Presbytery",
  },
  {
    name: "Redeemer Presbyterian Church",
    denomination: "PCA",
    address: "6150 Old Buncombe Road",
    city: "Greenville",
    state: "SC",
    website: "https://www.redeemerpres.church",
    phone: "(864) 610-9400",
    pastorName: "Nick Turner",
    pastorEmail: "Admin@redeemerpres.church",
    notes: "Calvary Presbytery",
  },
  {
    name: "Reidville Presbyterian Church",
    denomination: "PCA",
    address: "340 College Street",
    city: "Reidville",
    state: "SC",
    website: "https://reidvillepreschurch.com",
    phone: "(864) 433-9965",
    pastorName: "Duncan Hoopes Sr.",
    notes: "Calvary Presbytery",
  },
  {
    name: "Resurrection Presbyterian Church",
    denomination: "PCA",
    address: "335 Greenacre Road",
    city: "Greenville",
    state: "SC",
    website: "https://www.resurrectiongvl.com",
    phone: "(864) 720-4078",
    pastorName: "Jonathan Patrick Davis",
    pastorEmail: "jonathan@resurrectiongvl.com",
    notes: "Calvary Presbytery",
  },
  {
    name: "Rock Bridge Presbyterian Church",
    denomination: "PCA",
    address: "3714 Hwy 72 West",
    city: "Clinton",
    state: "SC",
    website: "https://rockbridgepca.com",
    notes: "Calvary Presbytery. Est. 1952.",
  },
  {
    name: "Roebuck Presbyterian Church",
    denomination: "PCA",
    address: "2179 E. Blackstock Road",
    city: "Roebuck",
    state: "SC",
    website: "https://roebuckpca.com",
    phone: "(864) 576-5717",
    pastorEmail: "richard@roebuckpca.com",
    notes: "Calvary Presbytery",
  },
  {
    name: "Second Presbyterian Church",
    denomination: "PCA",
    address: "105 River Street",
    city: "Greenville",
    state: "SC",
    website: "https://www.spcgreenville.org",
    phone: "(864) 232-7621",
    pastorName: "Richard D. Phillips",
    notes: "Calvary Presbytery",
  },
  {
    name: "Servant King Presbyterian Church",
    denomination: "PCA",
    address: "1100 Piedmont Park Road",
    city: "Taylors",
    state: "SC",
    pastorName: "Joe Dentici",
    notes: "Calvary Presbytery",
  },
  {
    name: "Smyrna Presbyterian Church",
    denomination: "PCA",
    address: "32 Smyrna Road",
    city: "Newberry",
    state: "SC",
    website: "https://www.smyrnanewberry.com",
    phone: "(803) 276-3943",
    pastorName: "Jim Daniel Wilkerson",
    pastorEmail: "dan@smyrnanewberry.com",
    notes: "Calvary Presbytery",
  },
  {
    name: "Westminster Presbyterian Church",
    denomination: "PCA",
    address: "1387 Highway 56 South",
    city: "Clinton",
    state: "SC",
    website: "https://wmpres.com",
    phone: "(864) 833-1275",
    pastorName: "Chad Reynolds",
    notes: "Calvary Presbytery",
  },
  {
    name: "Woodruff Road Presbyterian Church",
    denomination: "PCA",
    address: "2519 Woodruff Road",
    city: "Simpsonville",
    state: "SC",
    website: "https://www.woodruffroad.com",
    phone: "(864) 297-5257",
    pastorName: "Carl Robbins",
    pastorEmail: "info@woodruffroad.com",
    notes: "Calvary Presbytery",
  },
];

async function main() {
  console.log("🌱 Seeding TGC Church CRM...");
  console.log(`   Calvary Presbytery (PCA, SC) — ${calvaryPresbytery.length} churches`);

  let created = 0;
  let skipped = 0;

  for (const church of calvaryPresbytery) {
    const existing = await prisma.church.findFirst({
      where: { name: church.name, city: church.city ?? undefined, state: church.state ?? undefined },
    });
    if (existing) { skipped++; continue; }
    await prisma.church.create({ data: church });
    created++;
  }

  console.log(`   ✓ Created: ${created} churches`);
  if (skipped > 0) console.log(`   ↷ Skipped: ${skipped} already exist`);
  console.log("");
  console.log("Next steps:");
  console.log("  1. GET /api/geocode?batch=true  — populate map coordinates");
  console.log("  2. AI Search page               — discover more churches");
  console.log("  3. Import CSV                   — bulk import from spreadsheet");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
