import { PrismaClient, User } from '@prisma/client';
import { mockUsers, mockVideos } from '../src/data';

const prisma = new PrismaClient();

interface CreatedUser extends User {
  mockId: string;
}

async function main() {
  console.log('Start seeding ...');

  // Clear existing data
  await prisma.videoSource.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.video.deleteMany();
  await prisma.user.deleteMany();
  console.log('Cleared existing data.');

  // Create users
  const createdUsers: CreatedUser[] = [];
  for (const userData of mockUsers) {
    const user = await prisma.user.create({
      data: {
        name: userData.username, // Assuming name is username
        email: userData.email,
        username: userData.username,
        avatarUrl: userData.avatarUrl,
        role: userData.role,
        status: userData.status,
        isVerified: userData.isVerified,
        joinDate: new Date(userData.joinDate),
        lastLogin: userData.lastLogin ? new Date(userData.lastLogin) : undefined,
        bio: userData.bio,
        followers: userData.followers,
        following: userData.following,
        totalLikes: userData.totalLikes,
      },
    });
    createdUsers.push({ ...user, mockId: userData.id });
  }
  console.log(`Created ${createdUsers.length} users.`);

  // Create videos
  for (const videoData of mockVideos) {
    const author = createdUsers.find(u => u.mockId === videoData.user.id);
    if (!author) {
      console.warn(`Could not find author for video with mock user id ${videoData.user.id}`);
      continue;
    }

    const video = await prisma.video.create({
      data: {
        description: videoData.description,
        authorId: author.id,
        thumbnailUrl: videoData.thumbnailUrl,
        uploadDate: new Date(videoData.uploadDate),
        status: videoData.status,
        likes: videoData.likes,
        shares: videoData.shares,
        views: videoData.views,
        videoSources: {
          create: videoData.videoSources.map(source => ({
            quality: source.quality,
            url: source.url,
          })),
        },
        comments: {
          create: videoData.commentsData.map(commentData => {
            const commentAuthor = createdUsers.find(u => u.mockId === commentData.user.id);
            return {
              text: commentData.text,
              authorId: commentAuthor!.id,
              createdAt: new Date(), // mock data has '2h ago', which is not a date
            };
          }),
        },
      },
    });
    console.log(`Created video with id: ${video.id}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });