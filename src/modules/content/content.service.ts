import { prisma } from '@/lib/prisma';

export interface PublicFaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface PublicTestimonial {
  id: string;
  initials: string;
  avatarGradient: string;
  name: string;
  city: string;
  review: string;
  serviceType: string;
}

export interface PublicHeroImage {
  id: string;
  url: string;
  alt: string;
  variant: 'DESKTOP' | 'MOBILE' | 'BOTH';
}

export const ContentService = {
  async getFaqItems(): Promise<PublicFaqItem[]> {
    try {
      return await prisma.faqItem.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        select: { id: true, question: true, answer: true },
      });
    } catch {
      return [];
    }
  },

  async getTestimonials(): Promise<PublicTestimonial[]> {
    try {
      return await prisma.testimonial.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        select: {
          id: true,
          initials: true,
          avatarGradient: true,
          name: true,
          city: true,
          review: true,
          serviceType: true,
        },
      });
    } catch {
      return [];
    }
  },

  async getHeroImages(): Promise<PublicHeroImage[]> {
    try {
      return await prisma.heroImage.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        select: { id: true, url: true, alt: true, variant: true },
      });
    } catch {
      return [];
    }
  },
};
