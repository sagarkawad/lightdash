import {
    AdditionalMetric,
    ApiErrorPayload,
    GitIntegrationConfiguration,
    PreviewPullRequest,
    PullRequestCreated,
} from '@lightdash/common';
import {
    Body,
    Get,
    Middlewares,
    OperationId,
    Path,
    Post,
    Request,
    Response,
    Route,
    SuccessResponse,
    Tags,
} from '@tsoa/runtime';
import express from 'express';
import {
    allowApiKeyAuthentication,
    isAuthenticated,
    unauthorisedInDemo,
} from './authentication';
import { BaseController } from './baseController';

@Route('/api/v1/projects/{projectUuid}/git-integration')
@Response<ApiErrorPayload>('default', 'Error')
@Tags('Git Integration')
export class GitIntegrationController extends BaseController {
    @Middlewares([allowApiKeyAuthentication, isAuthenticated])
    @SuccessResponse('200', 'Success')
    @Get('/')
    @OperationId('GetConfiguration')
    async GetConfiguration(
        @Path() projectUuid: string,
        @Request() req: express.Request,
    ): Promise<{ status: 'ok'; results: GitIntegrationConfiguration }> {
        this.setStatus(200);
        return {
            status: 'ok',
            results: await this.services
                .getGitIntegrationService()
                .getConfiguration(req.user!, projectUuid),
        };
    }

    @Middlewares([
        allowApiKeyAuthentication,
        isAuthenticated,
        unauthorisedInDemo,
    ])
    @Middlewares([
        allowApiKeyAuthentication,
        isAuthenticated,
        unauthorisedInDemo,
    ])
    @SuccessResponse('200', 'Success')
    @Post('/pull-requests/custom-metrics')
    @OperationId('CreatePullRequestForCustomMetrics')
    async CreatePullRequestForCustomMetrics(
        @Path() projectUuid: string,
        @Body()
        body: {
            customMetrics: AdditionalMetric[];
            quoteChar?: `"` | `'`; // to be used in the yml dump options
        },
        @Request() req: express.Request,
    ): Promise<{ status: 'ok'; results: PullRequestCreated }> {
        this.setStatus(200);
        return {
            status: 'ok',
            results: await this.services
                .getGitIntegrationService()
                .createPullRequestForCustomMetrics(
                    req.user!,
                    projectUuid,
                    body.customMetrics,
                    body.quoteChar || '"',
                ),
        };
    }

    @Middlewares([
        allowApiKeyAuthentication,
        isAuthenticated,
        unauthorisedInDemo,
    ])
    @SuccessResponse('200', 'Success')
    @Post('/preview/custom-metrics')
    @OperationId('PreviewPullRequestForCustomMetrics')
    async PreviewPullRequestForCustomMetrics(
        @Path() projectUuid: string,
        @Body()
        body: {
            customMetrics: AdditionalMetric[];
            quoteChar?: `"` | `'`; // to be used in the yml dump options
        },
        @Request() req: express.Request,
    ): Promise<{ status: 'ok'; results: PreviewPullRequest }> {
        this.setStatus(200);
        return {
            status: 'ok',
            results: await this.services
                .getGitIntegrationService()
                .previewPullRequestForCustomMetrics(
                    req.user!,
                    projectUuid,
                    body.customMetrics,
                    body.quoteChar || '"',
                ),
        };
    }
}
