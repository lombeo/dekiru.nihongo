import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Users, Award, ChevronRight } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useUser } from "@/context/UserContext";

const progressData = [
  { name: "Mon", progress: 20 },
  { name: "Tue", progress: 40 },
  { name: "Wed", progress: 30 },
  { name: "Thu", progress: 70 },
  { name: "Fri", progress: 50 },
  { name: "Sat", progress: 80 },
  { name: "Sun", progress: 60 },
];

export default function HomePage() {
  const [progress] = useState(65);
  const userContext = useUser();
  const user = userContext?.user || null;
  console.log(user);
  return (
    <div className="min-h-screen bg-gray-100">

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.userName}-様!
        </h1>
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Overall Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Overall Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-gray-500">
                    You&apos;ve completed {progress}% of your courses
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Progress Chart */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Weekly Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="progress"
                        stroke="#8884d8"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recommended Lessons */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended Lessons</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/lessons/basic-greetings"
                      className="flex items-center text-blue-600 hover:underline"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Basic Greetings
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/lessons/hiragana-mastery"
                      className="flex items-center text-blue-600 hover:underline"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Hiragana Mastery
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/lessons/basic-sentence-structure"
                      className="flex items-center text-blue-600 hover:underline"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Basic Sentence Structure
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Practice Exercises */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Practice</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/practice/vocabulary-quiz"
                      className="flex items-center text-blue-600 hover:underline"
                    >
                      <Award className="h-4 w-4 mr-2" />
                      Vocabulary Quiz
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/practice/listening-exercise"
                      className="flex items-center text-blue-600 hover:underline"
                    >
                      <Award className="h-4 w-4 mr-2" />
                      Listening Exercise
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/practice/kanji-writing"
                      className="flex items-center text-blue-600 hover:underline"
                    >
                      <Award className="h-4 w-4 mr-2" />
                      Kanji Writing Practice
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Community Section */}
            <Card>
              <CardHeader>
                <CardTitle>Community</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/community/language-exchange"
                      className="flex items-center text-blue-600 hover:underline"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Language Exchange Partners
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/community/discussion-forum"
                      className="flex items-center text-blue-600 hover:underline"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Discussion Forum
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/community/study-groups"
                      className="flex items-center text-blue-600 hover:underline"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Study Groups
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Button className="w-full">Start a Lesson</Button>
              <Button className="w-full" variant="outline">
                Practice Speaking
              </Button>
              <Button className="w-full" variant="outline">
                Take a Quiz
              </Button>
              <Button className="w-full" variant="outline">
                Set Goals
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
