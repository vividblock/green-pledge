import Link from "next/link";
import { prisma } from "@/lib/prisma"; // We'll create this lib file

async function getPublicPledges() {
	const pledges = await prisma.pledge.findMany({
		where: { isPublic: true },
		orderBy: { createdAt: "desc" },
		take: 20,
	});
	return pledges;
}

export default async function HomePage() {
	const publicPledges = await getPublicPledges();

	return (
		<main className="container mx-auto p-4">
			<section className="mb-8">
				<h1 className="text-4xl font-bold mb-4">
					Welcome to the Green Pledge Initiative!
				</h1>
				<p className="text-lg mb-2">
					Our planet needs us. Make a commitment to reduce your carbon
					footprint. This platform allows individuals, non-profits, startups,
					and enterprises to create, share, and (soon) track their carbon
					reduction pledges.
				</p>
				<Link
					href="/create-pledge"
					className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
				>
					Create Your Pledge
				</Link>
			</section>

			<section>
				<h2 className="text-2xl font-semibold mb-3">Public Pledges</h2>
				{publicPledges.length === 0 ? (
					<p>No public pledges yet. Be the first!</p>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{publicPledges.map((pledge) => (
							<div key={pledge.id} className="border p-4 rounded-lg shadow">
								<h3 className="text-xl font-semibold">{pledge.title}</h3>
								<p className="text-sm text-gray-600">
									By: {pledge.creatorName || "Anonymous"} ({pledge.pledgerType})
									{pledge.pledgerOrgName && ` - ${pledge.pledgerOrgName}`}
								</p>
								<p className="text-sm text-gray-500 mt-1">
									Target:{" "}
									{pledge.targetCompletionDate
										? new Date(pledge.targetCompletionDate).toLocaleDateString()
										: "Not set"}
								</p>
								<div className="mt-2">
									<h4 className="font-medium">Steps:</h4>
									<ul className="list-disc list-inside text-sm">
										{pledge.steps.map((step, index) => (
											<li key={index}>{step}</li>
										))}
									</ul>
								</div>
								{/* Link to download/view full pledge - implement next */}
								<Link
									href={`/pledges/${pledge.id}/download`}
									className="mt-3 inline-block text-blue-500 hover:underline"
								>
									View & Download Details
								</Link>
							</div>
						))}
					</div>
				)}
			</section>
		</main>
	);
}
