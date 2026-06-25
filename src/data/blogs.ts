export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string; // HTML or Markdown format for rendering
  coverImage: string;
  date: string;
  author: string;
  tags: string[];
}

export const blogs: BlogPost[] = [
  {
    slug: "empowering-rural-women-assam-3d-printing",
    title: "Empowering Rural Women in Assam Through 3D Printing | TribeToy’s Sustainable Impact",
    excerpt: "In a world increasingly dominated by plastic and mass-produced toys, TribeToy stands out as a beacon of innovation, sustainability, and cultural pride.",
    coverImage: "/ghibli_impact.png",
    date: "June 25, 2026",
    author: "TribeToy Team",
    tags: ["Impact", "Sustainability", "Women Empowerment"],
    content: `
      <h2>Empowering Communities, Protecting the Planet, One Toy at a Time</h2>
      <p>In a world increasingly dominated by plastic and mass-produced toys, TribeToy stands out as a beacon of innovation, sustainability, and cultural pride. Based in Assam, TribeToy is reshaping the future of toys by blending eco-friendly materials, 3D printing technology, and traditional art forms—all while empowering women from indigenous communities.</p>

      <h2>The Eco-Revolution in Toy Manufacturing</h2>
      <p>TribeToy’s flagship initiative, Green Putola, is more than just a product line—it’s a movement. With sustainability at its core, every Green Putola toy is:</p>
      <ul>
        <li>Biodegradable and child-safe</li>
        <li>Crafted using Industry 4.0-powered 3D printing</li>
        <li>Hand-painted to reflect Assamese cultural symbols and stories</li>
        <li>Customizable for educational, decorative, or gifting purposes</li>
      </ul>
      <p>This unique combination helps reduce plastic waste and promotes environmentally conscious play.</p>

      <h2>Women Empowerment through Tech-Skilling</h2>
      <p>One of the most powerful aspects of TribeToy is its community-centric approach. Over 75 rural women from Assam’s Scheduled Tribe (ST) communities have been trained in 3D printing and modern manufacturing techniques. These women now contribute directly to the design and production of toys—building livelihoods while mastering future-ready skills.</p>

      <h2>Celebrating Assam Through Play</h2>
      <p>From Bihu dhols to Majuli masks, Krishna idols to playful dragons—each Green Putola toy tells a story rooted in Assam’s vibrant culture. These toys serve as both educational tools and cultural ambassadors, allowing children and adults alike to connect with the rich traditions of Northeast India in a modern, playful way.</p>

      <h2>Why TribeToy is a Game-Changer</h2>
      <p>Here’s what makes TribeToy a pioneer in sustainable toy innovation:</p>
      <ul>
        <li><strong>Tech + Tradition:</strong> Combines high-tech tools like 3D printing with hand-crafted finishing.</li>
        <li><strong>Sustainable Materials:</strong> Every toy is biodegradable, safe, and earth-friendly.</li>
        <li><strong>Inclusive Growth:</strong> Focuses on training and employing marginalized women from rural communities.</li>
        <li><strong>Educational Impact:</strong> Offers toys that support hands-on learning, language development, and geographic awareness.</li>
      </ul>

      <h2>Recent Collaborations & Milestones</h2>
      <p>We are incredibly proud to have partnered with prestigious institutions to bring 3D-printed sustainability to their major events. Recently, TribeToy was commissioned to design and manufacture custom awards and host interactive sessions, including:</p>
      <ul>
        <li><strong>IIT Guwahati SPE Student Chapter:</strong> Custom-designed world map trophies showcasing our precision 3D printing capabilities.</li>
        <li><strong>Inter IIT Sports & Aquatics Meet 2025:</strong> Eco-friendly medals and unique trophies for the winners, replacing traditional metal and plastic awards with sustainable alternatives.</li>
        <li><strong>Community Workshops:</strong> We regularly host hands-on workshops where children and adults interact with 3D-printed models—from pop culture icons like Hulk and Stitch to traditional Assamese Majuli masks—sparking curiosity, joy, and creativity.</li>
      </ul>

      <h2>Final Thoughts: Building a Better Future, One Toy at a Time</h2>
      <p>TribeToy is more than a brand—it’s a purpose-driven startup that bridges the gap between culture, creativity, and conscious living. As the world shifts towards sustainability, initiatives like TribeToy are showing the way forward—where innovation and tradition go hand in hand, and every toy holds a piece of a brighter, greener tomorrow.</p>
    `
  },
  {
    slug: "revolutionizing-sustainable-play-3d-printing",
    title: "How TribeToy is Revolutionizing Sustainable Play with 3D Printing",
    excerpt: "In a world where plastic toys dominate store shelves, TribeToy is carving a unique niche by introducing biodegradable, 3D-printed toys rooted in Assamese culture.",
    coverImage: "/ghibli_hero.png",
    date: "May 26, 2025",
    author: "admin",
    tags: ["Innovation", "3D Printing", "Sustainability"],
    content: `
      <p>In a world where plastic toys dominate store shelves, <strong>TribeToy</strong> is carving a unique niche by introducing <strong>biodegradable, 3D-printed toys</strong> rooted in Assamese culture. These aren’t just toys—they’re a statement about responsible consumption, cultural preservation, and innovation.</p>
      
      <p>By using <strong>eco-friendly materials</strong> and <strong>cutting-edge technology</strong>, TribeToy ensures that children’s playtime leaves a positive footprint on the planet. From hand-painted Assamese figurines to customizable superhero gifts, their range is a vibrant mix of education, art, and sustainability.</p>
      
      <p>With <strong>nationwide shipping, thoughtful packaging</strong>, and a strong ethical backbone, TribeToy isn’t just selling products—it’s building a movement toward greener childhoods.</p>
      
      <p>Explore more at <a href="/">tribe-toy.com</a></p>
    `
  }
];
