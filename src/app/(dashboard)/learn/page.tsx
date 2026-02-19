"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, FileText, BookOpen, ExternalLink } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import GlowCard from "@/components/ui/GlowCard";
import Badge from "@/components/ui/Badge";
import { PageSpinner } from "@/components/ui/Spinner";
import api from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import { capitalize } from "@/lib/utils";
import type { LearningContent } from "@/types";

const typeIcons = {
  video: Play,
  article: FileText,
  pdf: BookOpen,
};

export default function LearnPage() {
  const [content, setContent] = useState<LearningContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<LearningContent[]>(ENDPOINTS.LEARNING.CONTENT)
      .then(({ data }) => setContent(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageSpinner />;

  // Group by category
  const grouped = content.reduce((acc, item) => {
    const cat = item.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, LearningContent[]>);

  return (
    <PageTransition>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Learning Hub</h1>
          <p className="text-sm text-gray-400 mt-1">Educational content to improve your trading</p>
        </div>

        {content.length === 0 ? (
          <div className="bg-dark-200/80 border border-white/5 rounded-2xl p-12 text-center">
            <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500">No content available yet</p>
          </div>
        ) : (
          Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <h2 className="text-lg font-semibold text-white mb-4">
                {capitalize(category.replace(/_/g, " "))}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item, i) => {
                  const Icon = typeIcons[item.content_type] || FileText;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <GlowCard className="h-full">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-neon/10 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-neon" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                            {item.description && (
                              <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-3">
                              <Badge>{capitalize(item.content_type)}</Badge>
                              {item.content_url && (
                                <a
                                  href={item.content_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-neon hover:underline"
                                >
                                  Open <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </GlowCard>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </PageTransition>
  );
}
