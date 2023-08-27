import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    await prisma.product.create({
      data: {
        title: "PSC 199",
        desc: "Aplikasi manajemen untuk monitoring petugas PCS dan terintegrasi dengan Whatsapp",
        image: "https://gdrive.azfasa15.workers.dev/psc199.png",
        filename: "psc199.png",
      },
    });

    await prisma.product.create({
      data: {
        title: "E-office",
        desc: "Aplikasi untuk monitoring dan absensi ASN",
        image: "https://gdrive.azfasa15.workers.dev/E-OFFICE.png",
        filename: "E-OFFICE.png",
      },
    });

    await prisma.product.create({
      data: {
        title: "SIMRS",
        desc: "Aplikasi manajemen untuk monitoring petugas RS dan terintegrasi dengan Whatsapp",
        image: "https://gdrive.azfasa15.workers.dev/simrs.png",
        filename: "simrs.png",
      },
    });

    const leftText = "Together We Make";
    const leftDesc = "Digital Product & Experiences.";
    const HighlightedText = ["Happy", "Inovative", "Distruptive", "Magic"];

    await Promise.all(
      HighlightedText.map((ht) =>
        prisma.hero.create({
          data: {
            position: "Left",
            text: leftText,
            hText: ht,
            desc: leftDesc,
          },
        })
      )
    );

    const Text = [
      "Between your business objectives and what your customers want.",
      "Between your business objectives and what your client want.",
      "Between your smth.",
      "Hmm",
    ];
    await Promise.all(
      Text.map(async (lt, i) =>
        prisma.hero.create({
          data: {
            position: "Right",
            number: i + 1,
            text: lt,
          },
        })
      )
    );

    await prisma.noiu_in_number.create({
      data: {
        client: 200,
        produk: 45,
        pekerjaan: 334,
        tim: 34,
      },
    });

    await prisma.user.create({
      data: {
        name: "Muhammad Azfa",
        username: "azfasa15",
        avatar:
          "https://lh3.googleusercontent.com/ogw/AGvuzYaJeui6GgKwfaEyE8GJaRKwWYFB-JiVjRQp_xjhMQ=s400-c-mo",
        job: "Admin",
        token: "asdasdasdas",
        email: "random3@random.com",
        password: "test",
      },
    });
    await prisma.user.create({
      data: {
        name: "Hafiz Haekal",
        username: "hafizhaekal",
        avatar:
          "https://lh3.googleusercontent.com/ogw/AGvuzYaJeui6GgKwfaEyE8GJaRKwWYFB-JiVjRQp_xjhMQ=s400-c-mo",
        job: "UI UX",
        token: "asdasdasdas",
        email: "random2@random.com",
        password: "test",
      },
    });
    await prisma.user.create({
      data: {
        name: "M Ghazy",
        username: "ghazydev",
        avatar:
          "https://lh3.googleusercontent.com/ogw/AGvuzYaJeui6GgKwfaEyE8GJaRKwWYFB-JiVjRQp_xjhMQ=s400-c-mo",
        job: "Frontend",
        token: "asdasdasdas",
        email: "random1@random.com",
        password: "test",
      },
    });

    const service = [
      [
        "IT Consultant",
        "Design Branding",
        "Education",
        "Multimedia",
        "Event Organizer",
        "Digital Marketing",
      ],
      [
        "Programmer yang professional hingga dipercaya pemerintah",
        " Branding yang konsisten dan efektif dapat membangun kepercayaan pelanggan dan meningkatkan pertumbuhan jangka panjang.",
        "lorem",
        "lorem",
        "lorem",
        "lorem",
      ],
      ["/mdx/itc", "/mdx/db", "/mdx/edu", "/mdx/mm", "/mdx/eo", "/mdx/dm"],
      [
        "https://gdrive.azfasa15.workers.dev/it_consultant.svg",
        "https://gdrive.azfasa15.workers.dev/design_branding.svg",
        "https://gdrive.azfasa15.workers.dev/education.svg",
        "https://gdrive.azfasa15.workers.dev/multimedia.svg",
        "https://gdrive.azfasa15.workers.dev/event_organizer.svg",
        "https://gdrive.azfasa15.workers.dev/digital_marketing.svg",
      ],
    ];

    service[0].forEach(async (_, i) => {
      const title = service[0][i];
      const desc = service[1][i];
      const link = service[2][i];
      const logo = service[3][i];

      await prisma.service.create({
        data: {
          title,
          desc,
          link,
          logo,
          filename: "dummy.png",
        },
      });
    });

    const testimony = [
      ["Azfasa15", "Ghazydev", "HafizHaekal"],
      ["Kaum", "Cipamengpeuk", "Sukatali"],
      [
        "NOIU Best gasih?",
        "Maybe? ahahah",
        "NOIU sangat realistis sih ceuk urang mah",
      ],
      [4.5, 4.6, 4.5],
      [
        "https://github.com/Rodeobazaar124.png",
        "https://github.com/xylviet.png",
        "https://github.com/hafizhaekall.png",
      ],
    ];

    const partnership = [
      [
        "SMKN 2 SUMEDANG",
        "SMKN 1 SUMEDANG",
        "MIMIK",
        "TAHU NGODING",
        "POLDA JAWA BARAT",
      ],
      [
        "https://gdrive.azfasa15.workers.dev/smea.png",
        "https://gdrive.azfasa15.workers.dev/nesas.png",
        "https://gdrive.azfasa15.workers.dev/mimik.png",
        "https://gdrive.azfasa15.workers.dev/tahungoding.png",
        "https://gdrive.azfasa15.workers.dev/polda_jabar.png",
      ],
    ];

    partnership[0].forEach(async (_, i) => {
      const name = partnership[0][i];
      const image = partnership[1][i];
      await prisma.partnership.create({
        data: {
          name,
          image,
          filename: "fill.png",
        },
      });
    });

    testimony[0].forEach(async (_, i) => {
      const username = testimony[0][i];
      const location = testimony[1][i];
      const comment = testimony[2][i];
      const rating = testimony[3][i];
      const avatar = testimony[4][i];

      await prisma.testimony.create({
        data: {
          username: username.toString(),
          location: location.toString(),
          comment: comment.toString(),
          rating: parseFloat(rating.toString()),
          avatar: avatar.toString(),
          filename: "dump.png",
        },
      });
    });

    console.log("Data berhasil ditambahkan ke database.");
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
