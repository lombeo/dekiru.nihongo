import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader } from "../loader"

export default function SurveyPage() {
  // Thay thế URL này bằng URL của Google Form của bạn
  const googleFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSd1a3UZMLf3eGPOEbLB7iEDRxQPcsf3XKNMenttCWeWf4PVVQ/viewform?embedded=true"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const iframe = document.getElementById('survey-iframe');
    const handleLoad = () => setLoading(false);

    if (iframe) {
      iframe.addEventListener('load', handleLoad);
    }

    return () => {
      if (iframe) {
        iframe.removeEventListener('load', handleLoad);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-indigo-200 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="w-full shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-indigo-800">
              Khảo sát ý kiến học viên
            </CardTitle>
            <CardDescription className="text-center text-lg text-indigo-600">
              Chúng tôi rất trân trọng ý kiến đóng góp của bạn để cải thiện chất lượng dịch vụ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video w-full">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-opacity-10">
                  <Loader />
                </div>
              )}
              <iframe
                id="survey-iframe"
                src={googleFormUrl}
                className="w-full h-full border-0"
                frameBorder="0"
                marginHeight={0}
                marginWidth={0}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
