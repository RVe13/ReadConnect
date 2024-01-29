import {Server as NetServer, Socket} from "net"
import { NextApiResponse } from "next";
import {Server as SocketIOServer} from "socket.io"
import {Community, Member, Profile} from "@prisma/client"

export type CommunityWtihMembersWithProfiles = Community &{
    members:(Member & {profile: Profile})[];
};

export type NextApiResponseServerIo = NextApiResponse & {
    socket: Socket & {
        server: NetServer &{
            io: SocketIOServer
        }
    }
}