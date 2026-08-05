"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Bot, Orbit, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import type { FC, ReactNode } from "react";

interface NowCardProps {
  title: string;
  description: string[];
  icon?: ReactNode;
}

const NowCard: FC<NowCardProps> = ({ title, description, icon }) => {
  return (
    <div className="inline-block">
      <Card
        className="
          group cursor-pointer
          text-white rounded-2xl border border-white/10
          bg-gradient-to-br from-[#010101] via-[#090909] to-[#010101]
          shadow-2xl relative backdrop-blur-xl overflow-hidden
          transition-transform duration-300
          hover:scale-105 hover:-rotate-1
          hover:border-white/25 hover:shadow-white/5
          w-full max-w-[420px]
        "
      >
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-white/10 opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
          <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-gradient-to-tr from-white/10 to-transparent blur-3xl opacity-30 group-hover:opacity-50 transform group-hover:scale-110 transition-all duration-700 animate-bounce"></div>
          <div className="absolute top-10 left-10 w-16 h-16 rounded-full bg-white/5 blur-xl animate-ping"></div>
          <div className="absolute bottom-16 right-16 w-12 h-12 rounded-full bg-white/5 blur-lg animate-ping"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
        </div>

        <CardHeader className="relative z-10 p-6">
          <div className="flex items-center justify-between">
            <Badge className="bg-white/10 text-white/90">Current</Badge>
            <Link to="/contact">
              <Button size="sm" variant="secondary">
                Contact
              </Button>
            </Link>
          </div>
          <h3 className="mt-4 text-3xl font-bold bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
            {title}
          </h3>
        </CardHeader>

        <Separator className="relative z-10 mx-6" />

        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping"></div>
              <div className="absolute inset-0 rounded-full border border-white/10 animate-pulse"></div>

              <div className="p-6 rounded-full backdrop-blur-lg border border-white/20 bg-gradient-to-br from-black/80 to-black/60 shadow-2xl transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 hover:shadow-white/20">
                <div className="transform group-hover:rotate-180 transition-transform duration-700">
                  {icon}
                </div>
              </div>
            </div>
          </div>

          <ul className="space-y-1 max-w-sm">
            {description.map((line, idx) => (
              <p
                key={idx}
                className="text-gray-300 text-sm leading-relaxed transform group-hover:text-gray-200 transition-colors duration-300"
              >
                {line}
              </p>
            ))}
          </ul>

          <div className="mt-6 w-1/3 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent rounded-full transform group-hover:w-1/2 group-hover:h-1 transition-all duration-500 animate-pulse"></div>

          <div className="flex space-x-2 mt-4 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
        </CardContent>

        <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-br-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-white/10 to-transparent rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </Card>
    </div>
  );
};

export function NowStatusCard() {
  return (
    <NowCard
      title="Now"
      icon={<Zap className="h-6 w-6 text-white" />}
      description={[
        "Master's student at MBZUAI - AIRoCS Lab (Department of Robotics)",
        "Started at MBZUAI as a Research Engineer",
        "Focus: smarter, safer and more precise manipulation control",
        "Open to: collaborations, research internships, PhD Offers, Remote Jobs",
      ]}
    />
  );
}

export default NowCard;
