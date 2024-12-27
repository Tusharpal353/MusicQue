import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
const ytRegex = new RegExp(
   /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com\/(?:watch\?(?!.*\blist=)(?:.*&)?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[?&]\S+)?$/
);
const CreateSchema = z.object({
  creatorId: z.string(),
  url: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const data = CreateSchema.parse(await req.json());
    const isYt = ytRegex.test(data.url);
    if (!isYt) {
      return NextResponse.json(
        {
          message: "This is not a youtube URl",
        },
        {
          status: 404,
        }
      );
    }
    const extractedId = data.url.split("?v=")[1];
     const videoData =await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${extractedId}&key=${process.env.GOOGLE_API_KEY}&part=snippet,contentDetails,statistics`).then(res=>res.json())
     const title = videoData.items[0].snippet.title;
     const thumbnails = videoData.items[0].snippet.thumbnails;
     const thumbnailsArray: Array<{ width: number; url: string }> = Object.values(thumbnails);

 
     console.log("Title:", title);
     console.log("Thumbnails:", thumbnails);
     thumbnailsArray.sort((a:{width:number},b:{width:number})=>a.width < b.width ? -1:1)
     const smallImg =
     thumbnailsArray.length > 1
       ? thumbnailsArray[thumbnailsArray.length - 2]?.url // Safe access using optional chaining
       : thumbnailsArray[thumbnailsArray.length - 1]?.url ?? "https://media.istockphoto.com/id/1317323736/photo/a-view-up-into-the-trees-direction-sky.jpg?s=612x612&w=0&k=20&c=i4HYO7xhao7CkGy7Zc_8XSNX_iqG0vAwNsrH1ERmw2Q=";
       const bigImg =
       thumbnailsArray[thumbnailsArray.length - 1]?.url ?? "https://media.istockphoto.com/id/1317323736/photo/a-view-up-into-the-trees-direction-sky.jpg?s=612x612&w=0&k=20&c=i4HYO7xhao7CkGy7Zc_8XSNX_iqG0vAwNsrH1ERmw2Q=";
     
   const stream =  await prismaClient.stream.create({
      data: {
        userId: data.creatorId,
        url: data.url,
        extractedId,
        type: "youtube",
        title:title ?? "cant find the video",
        smallImg:smallImg,
        bigImg:bigImg,
    }});


    return NextResponse.json({
        message:"added stream",
        id:stream.id
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json(
      {
        message: "error adding the stream",
      },
      {
        status: 411,
      }
    );
  }
}

export async function GET(req: NextRequest) {
  const creatorId = req.nextUrl.searchParams.get("creatorid");
  const streams = await prismaClient.stream.findMany({
    where: {
      userId: creatorId ?? "",
    },
  });
  return NextResponse.json({
    streams,
  });
}
