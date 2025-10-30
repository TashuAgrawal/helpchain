import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { MessageCircle, Star } from 'lucide-react'

interface Feedback {
  user: string;
  feedback: string;
  time: string;
  rating: number;
}

interface UserFeedbackProps {
  userFeedbacks: Feedback[];
}

const UserFeedback: React.FC<UserFeedbackProps> = ({ userFeedbacks }) => {
  return (
    <Card className="rounded-xl border-none shadow-sm bg-white dark:bg-gray-800 transition-colors duration-300">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">Recent User Feedback</CardTitle>
        <CardDescription className="dark:text-gray-400">User experiences with donation and NGO updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          {userFeedbacks.map((fb, idx) => (
            <div key={idx} className="mb-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">"{fb.feedback}" - {fb.user}</p>
              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <MessageCircle className="w-3 h-3" />
                {fb.time}
                <span className="ml-2 flex gap-0.5 text-yellow-500">
                  {Array(fb.rating).fill(0).map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default UserFeedback
