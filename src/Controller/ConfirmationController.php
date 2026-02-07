<?php
namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ConfirmationController extends AbstractController
{
    /**
     * @Route("/confirm", name="confirm_account", methods={"GET"})
     */
    public function confirm(Request $request, EntityManagerInterface $em): Response
    {
        $token = $request->query->get('token');
        if (!$token) {
            return new JsonResponse(['error' => 'token_required'], Response::HTTP_BAD_REQUEST);
        }

        $user = $em->getRepository(User::class)->findOneBy(['verificationToken' => $token]);
        if (!$user) {
            return new JsonResponse(['error' => 'invalid_token'], Response::HTTP_NOT_FOUND);
        }

        $user->setIsVerified(true);
        $user->setVerificationToken(null);
        $em->flush();

        return new JsonResponse(['status' => 'ok', 'message' => 'account_confirmed']);
    }
}
